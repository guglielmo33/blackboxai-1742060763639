// Forum data structure
let forumPosts = [
    {
        id: 1,
        author: "Mario Rossi",
        avatar: "https://ui-avatars.com/api/?name=Mario+Rossi&background=random",
        title: "Domanda sul calcolo differenziale",
        content: "Qualcuno può aiutarmi con gli esercizi di analisi matematica?",
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        replies: 5,
        likes: 12
    }
];

// Forum functionality
class Forum {
    constructor() {
        this.posts = forumPosts;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // New discussion button
        const newDiscussionBtn = document.querySelector('button i.fa-plus').parentElement;
        if (newDiscussionBtn) {
            newDiscussionBtn.addEventListener('click', () => this.showNewPostModal());
        }

        // Like and reply buttons
        // Event delegation for dynamic elements
        document.addEventListener('click', (e) => {
            const likeButton = e.target.closest('.like-button');
            const replyButton = e.target.closest('.reply-button');
            
            if (likeButton) {
                const post = likeButton.closest('.post');
                if (post) {
                    const postId = post.dataset.postId;
                    this.likePost(postId);
                }
            }
            
            if (replyButton) {
                const post = replyButton.closest('.post');
                if (post) {
                    const postId = post.dataset.postId;
                    this.showReplyModal(postId);
                }
            }
        });
    }

    createPost(title, content) {
        const newPost = {
            id: this.posts.length + 1,
            author: "Utente", // In a real app, this would come from authentication
            avatar: "https://ui-avatars.com/api/?name=User&background=random",
            title: title,
            content: content,
            timestamp: new Date(),
            replies: 0,
            likes: 0
        };

        this.posts.unshift(newPost);
        this.renderPosts();
    }

    likePost(postId) {
        const post = this.posts.find(p => p.id === parseInt(postId));
        if (post) {
            post.likes++;
            this.renderPosts();
        }
    }

    showNewPostModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Nuova Discussione</h3>
                <input type="text" placeholder="Titolo" class="w-full mb-4 p-2 border rounded" id="post-title">
                <textarea placeholder="Contenuto" class="w-full mb-4 p-2 border rounded h-32" id="post-content"></textarea>
                <div class="flex justify-end space-x-3">
                    <button class="px-4 py-2 text-gray-600 hover:text-gray-800" id="cancel-post">Annulla</button>
                    <button class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" id="submit-post">Pubblica</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('cancel-post').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('submit-post').addEventListener('click', () => {
            const title = document.getElementById('post-title').value;
            const content = document.getElementById('post-content').value;
            
            if (title && content) {
                this.createPost(title, content);
                document.body.removeChild(modal);
            }
        });
    }

    formatTimestamp(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} giorni fa`;
        if (hours > 0) return `${hours} ore fa`;
        if (minutes > 0) return `${minutes} minuti fa`;
        return 'Proprio ora';
    }

    renderPosts() {
        const forumContainer = document.querySelector('.space-y-6');
        if (!forumContainer) return;

        forumContainer.innerHTML = this.posts.map(post => `
            <div class="border-b pb-6 post" data-post-id="${post.id}">
                <div class="flex items-center mb-2">
                    <img class="h-10 w-10 rounded-full" src="${post.avatar}" alt="${post.author}">
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">${post.author}</p>
                        <p class="text-sm text-gray-500">${this.formatTimestamp(post.timestamp)}</p>
                    </div>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">${post.title}</h3>
                <p class="text-gray-600">${post.content}</p>
                <div class="mt-3 flex items-center space-x-4">
                    <button class="text-gray-500 hover:text-indigo-600 reply-button">
                        <i class="far fa-comment mr-1"></i> ${post.replies} risposte
                    </button>
                    <button class="text-gray-500 hover:text-indigo-600 like-button">
                        <i class="far fa-heart mr-1"></i> ${post.likes}
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize forum when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const forum = new Forum();
    forum.renderPosts();
});
