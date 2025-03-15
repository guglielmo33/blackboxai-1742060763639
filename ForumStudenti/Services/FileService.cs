using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ForumStudenti.Models;

namespace ForumStudenti.Services
{
    public interface IFileService
    {
        Task<List<FileItem>> GetFilesAsync();
        Task<FileItem> GetFileByIdAsync(int id);
        Task<FileItem> UploadFileAsync(FileItem file);
    }

    public class FileService : IFileService
    {
        private readonly List<FileItem> _fileSystem = new()
        {
            new FileItem
            {
                Id = 1,
                Name = "Matematica",
                Type = "folder",
                Children = new List<FileItem>
                {
                    new FileItem
                    {
                        Id = 2,
                        Name = "Appunti_Analisi.pdf",
                        Type = "file",
                        Extension = "pdf",
                        Size = 2621440, // 2.5 MB
                        LastModified = DateTime.Now.AddDays(-2),
                        Path = "/Matematica/Appunti_Analisi.pdf"
                    },
                    new FileItem
                    {
                        Id = 3,
                        Name = "Esercizi",
                        Type = "folder",
                        Children = new List<FileItem>
                        {
                            new FileItem
                            {
                                Id = 4,
                                Name = "Esercizi_Capitolo1.pdf",
                                Type = "file",
                                Extension = "pdf",
                                Size = 1258291, // 1.2 MB
                                LastModified = DateTime.Now.AddDays(-1),
                                Path = "/Matematica/Esercizi/Esercizi_Capitolo1.pdf"
                            }
                        }
                    }
                }
            },
            new FileItem
            {
                Id = 5,
                Name = "Fisica",
                Type = "folder",
                Children = new List<FileItem>
                {
                    new FileItem
                    {
                        Id = 6,
                        Name = "Appunti_Meccanica.pdf",
                        Type = "file",
                        Extension = "pdf",
                        Size = 3250585, // 3.1 MB
                        LastModified = DateTime.Now.AddDays(-3),
                        Path = "/Fisica/Appunti_Meccanica.pdf"
                    }
                }
            }
        };

        public async Task<List<FileItem>> GetFilesAsync()
        {
            await Task.Delay(200);
            return _fileSystem;
        }

        public async Task<FileItem> GetFileByIdAsync(int id)
        {
            await Task.Delay(100);
            return FindFileById(id, _fileSystem);
        }

        public async Task<FileItem> UploadFileAsync(FileItem file)
        {
            await Task.Delay(1000); // Simulate upload time
            var maxId = GetMaxId(_fileSystem);
            file.Id = maxId + 1;
            file.LastModified = DateTime.Now;

            // Find parent folder and add file
            if (!string.IsNullOrEmpty(file.Path))
            {
                var parentPath = System.IO.Path.GetDirectoryName(file.Path)?.Replace("\\", "/");
                var parent = FindFolderByPath(parentPath, _fileSystem);
                if (parent != null)
                {
                    parent.Children.Add(file);
                }
            }
            else
            {
                _fileSystem.Add(file);
            }

            return file;
        }

        private FileItem FindFileById(int id, List<FileItem> items)
        {
            foreach (var item in items)
            {
                if (item.Id == id) return item;
                if (item.Children?.Count > 0)
                {
                    var found = FindFileById(id, item.Children);
                    if (found != null) return found;
                }
            }
            return null;
        }

        private FileItem FindFolderByPath(string path, List<FileItem> items)
        {
            foreach (var item in items)
            {
                if (item.IsFolder && item.Path == path) return item;
                if (item.Children?.Count > 0)
                {
                    var found = FindFolderByPath(path, item.Children);
                    if (found != null) return found;
                }
            }
            return null;
        }

        private int GetMaxId(List<FileItem> items)
        {
            int maxId = 0;
            foreach (var item in items)
            {
                maxId = Math.Max(maxId, item.Id);
                if (item.Children?.Count > 0)
                {
                    maxId = Math.Max(maxId, GetMaxId(item.Children));
                }
            }
            return maxId;
        }
    }
}
