using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ForumStudenti.Models;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;

namespace ForumStudenti.Services
{
    public interface IAzureStorageService
    {
        Task<List<FileItem>> GetFilesAsync(string containerName);
        Task<BlobDownloadInfo> DownloadFileAsync(string containerName, string blobName);
        Task UploadFileAsync(string containerName, string blobName, Stream content);
        Task DeleteFileAsync(string containerName, string blobName);
    }

    public class AzureStorageService : IAzureStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly IConfiguration _configuration;

        public AzureStorageService(IConfiguration configuration)
        {
            _configuration = configuration;
            var connectionString = _configuration["AzureStorage:ConnectionString"];
            _blobServiceClient = new BlobServiceClient(connectionString);
        }

        public async Task<List<FileItem>> GetFilesAsync(string containerName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var files = new List<FileItem>();
            var rootFolder = new FileItem
            {
                Name = containerName,
                Type = "folder",
                Children = new List<FileItem>()
            };

            await foreach (var blobItem in containerClient.GetBlobsAsync())
            {
                var pathParts = blobItem.Name.Split('/');
                var currentFolder = rootFolder;

                for (int i = 0; i < pathParts.Length - 1; i++)
                {
                    var folderName = pathParts[i];
                    var existingFolder = currentFolder.Children
                        .FirstOrDefault(f => f.IsFolder && f.Name == folderName);

                    if (existingFolder == null)
                    {
                        existingFolder = new FileItem
                        {
                            Name = folderName,
                            Type = "folder",
                            Path = string.Join("/", pathParts.Take(i + 1)),
                            Children = new List<FileItem>()
                        };
                        currentFolder.Children.Add(existingFolder);
                    }

                    currentFolder = existingFolder;
                }

                var fileName = pathParts.Last();
                var extension = Path.GetExtension(fileName).TrimStart('.');
                var properties = await containerClient.GetBlobClient(blobItem.Name)
                    .GetPropertiesAsync();

                var fileItem = new FileItem
                {
                    Name = fileName,
                    Type = "file",
                    Extension = extension,
                    Size = properties.Value.ContentLength,
                    LastModified = properties.Value.LastModified.DateTime,
                    Path = blobItem.Name
                };

                currentFolder.Children.Add(fileItem);
            }

            return rootFolder.Children;
        }

        public async Task<BlobDownloadInfo> DownloadFileAsync(string containerName, string blobName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);
            var response = await blobClient.DownloadAsync();
            return response.Value;
        }

        public async Task UploadFileAsync(string containerName, string blobName, Stream content)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            await containerClient.CreateIfNotExistsAsync();
            var blobClient = containerClient.GetBlobClient(blobName);
            await blobClient.UploadAsync(content, true);
        }

        public async Task DeleteFileAsync(string containerName, string blobName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);
            await blobClient.DeleteIfExistsAsync();
        }
    }
}
