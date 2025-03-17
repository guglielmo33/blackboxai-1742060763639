using Microsoft.EntityFrameworkCore;
using ForumStudenti.Models;

namespace ForumStudenti.Services
{
    public class ForumDbContext : DbContext
    {
        public ForumDbContext(DbContextOptions<ForumDbContext> options)
            : base(options)
        {
        }

        public DbSet<Post> Posts { get; set; } = null!;
        public DbSet<Reply> Replies { get; set; } = null!;
        public DbSet<Author> Authors { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired();
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.Category).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                
                entity.HasOne(e => e.Author)
                    .WithMany()
                    .HasForeignKey("AuthorId")
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(e => e.Replies)
                    .WithOne()
                    .HasForeignKey("PostId")
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Reply>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();

                entity.HasOne(e => e.Author)
                    .WithMany()
                    .HasForeignKey("AuthorId")
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Author>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.AvatarUrl).IsRequired();
            });

            // Seed data
            modelBuilder.Entity<Author>().HasData(
                new Author { Id = 1, Name = "Mario Rossi", AvatarUrl = "https://ui-avatars.com/api/?name=Mario+Rossi&background=random" },
                new Author { Id = 2, Name = "Laura Bianchi", AvatarUrl = "https://ui-avatars.com/api/?name=Laura+Bianchi&background=random" }
            );

            modelBuilder.Entity<Post>().HasData(
                new Post
                {
                    Id = 1,
                    Title = "Domanda sul calcolo differenziale",
                    Content = "Qualcuno può aiutarmi con gli esercizi di analisi matematica?",
                    Category = "Matematica",
                    CreatedAt = DateTime.Now.AddHours(-2),
                    AuthorId = 1,
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
                    AuthorId = 2,
                    LikesCount = 15,
                    RepliesCount = 8
                }
            );
        }
    }
}
