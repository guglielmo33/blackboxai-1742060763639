using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ForumStudenti.Models;

namespace ForumStudenti.Services
{
    public interface IForumService
    {
        Task<List<Post>> GetPostsAsync();
        Task<Post> GetPostByIdAsync(int id);
        Task<Post> CreatePostAsync(Post post);
        Task<Post> LikePostAsync(int id);
        Task<Reply> AddReplyAsync(int postId, Reply reply);
    }

    public class ForumService : IForumService
    {
        private readonly List<Post> _posts = new()
            {
                new Post
                {
                    Id = 1,
                    Title = "Domanda sul calcolo differenziale",
                    Content = "Qualcuno può aiutarmi con gli esercizi di analisi matematica?",
                    Category = "Matematica",
                    CreatedAt = DateTime.Now.AddHours(-2),
                    Author = new Author
                    {
                        Name = "Mario Rossi",
                        AvatarUrl = "https://ui-avatars.com/api/?name=Mario+Rossi&background=random"
                    },
                    LikesCount = 12,
                    RepliesCount = 5
                },
                new Post
                {
                    Id = 2,
                    Title = "Dubbio sulla meccanica quantistica",
                    Content = "Come si interpreta correttamente il principio di indeterminazione di Heisenberg?",
                    Category = "Fisica",
                    CreatedAt = DateTime.Now.AddHours(-4),
                    Author = new Author
                    {
                        Name = "Laura Bianchi",
                        AvatarUrl = "https://ui-avatars.com/api/?name=Laura+Bianchi&background=random"
                    },
                    LikesCount = 15,
                    RepliesCount = 8
                }
            };

        public async Task<List<Post>> GetPostsAsync()
        {
            // Simulate API delay
            await Task.Delay(300);
            return _posts.OrderByDescending(p => p.CreatedAt).ToList();
        }

        public async Task<Post?> GetPostByIdAsync(int id)
        {
            await Task.Delay(100);
            return _posts.FirstOrDefault(p => p.Id == id);
        }

        public async Task<Post> CreatePostAsync(Post post)
        {
            await Task.Delay(500);
            post.Id = _posts.Max(p => p.Id) + 1;
            post.CreatedAt = DateTime.Now;
            post.LikesCount = 0;
            post.RepliesCount = 0;
            _posts.Add(post);
            return post;
        }

        public async Task<Post> LikePostAsync(int id)
        {
            await Task.Delay(100);
            var post = _posts.FirstOrDefault(p => p.Id == id);
            if (post != null)
            {
                post.LikesCount++;
            }
            else
            {
                post = new Post() { Id = id, LikesCount = 1 };
                _posts.Add(post);
            }
            return post;

        }

        public async Task<Reply> AddReplyAsync(int postId, Reply reply)
        {
            await Task.Delay(300);
            var post = _posts.FirstOrDefault(p => p.Id == postId);
            if (post != null)
            {
                reply.Id = post.Replies.Count + 1;
                reply.CreatedAt = DateTime.Now;
                post.Replies.Add(reply);
                post.RepliesCount++;
            }
            else
            {
                post = new Post() { Id = postId, LikesCount = 1 ,RepliesCount = 1 };
                post.Replies = new List<Reply>();
                reply.Id = 1;
                reply.CreatedAt = DateTime.Now;
                post.Replies.Add(reply);
                _posts.Add(post);
            }
            return reply;
        }
    }
}
