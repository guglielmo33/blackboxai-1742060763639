using System;
using System.Collections.Generic;

namespace ForumStudenti.Models
{
    public class FileItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "folder" or "file"
        public string Extension { get; set; } = string.Empty;
        public long Size { get; set; }
        public DateTime LastModified { get; set; }
        public string Path { get; set; } = string.Empty;
        public List<FileItem> Children { get; set; } = new();
        
        public bool IsFolder => Type == "folder";
        public string IconClass => GetIconClass();
        public string FormattedSize => FormatSize();

        private string GetIconClass()
        {
            if (IsFolder)
                return "fas fa-folder text-yellow-500";

            return Extension?.ToLower() switch
            {
                "pdf" => "fas fa-file-pdf text-red-500",
                "doc" or "docx" => "fas fa-file-word text-blue-500",
                "xls" or "xlsx" => "fas fa-file-excel text-green-500",
                "jpg" or "jpeg" or "png" => "fas fa-file-image text-purple-500",
                _ => "fas fa-file text-gray-500"
            };
        }

        private string FormatSize()
        {
            if (IsFolder) return string.Empty;
            string[] sizes = { "B", "KB", "MB", "GB" };
            int order = 0;
            double len = Size;

            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }

            return $"{len:0.#} {sizes[order]}";
        }
    }
}
