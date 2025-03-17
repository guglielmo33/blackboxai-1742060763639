using System;
using System.Collections.Generic;

namespace ForumStudenti.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int AuthorId { get; set; }
        public Author Author { get; set; } = null!;
        public int LikesCount { get; set; }
        public int RepliesCount { get; set; }
        public List<Reply> Replies { get; set; } = new();
    }

    public class Author
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
    }

    public class Reply
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int AuthorId { get; set; }
        public Author Author { get; set; } = null!;
        public int PostId { get; set; }
    }
}
