// Forum class to manage forum posts and interactions
class Forum {
    constructor() {
        this.posts = [
            {
                id: 1,
                author: {
                    name: 'Mario Rossi',
                    avatar: 'https://ui-avatars.com/api/?name=Mario+Rossi&background=random'
                },
                title: 'Domanda sul calcolo differenziale',
                content: 'Qualcuno può aiutarmi con gli esercizi di analisi matematica?',
                category: 'Matematica',
                timestamp: new Date(Date.now() - 7200000), // 2 hours ago
                likes: 12,
                replies: 5
            },
            {
                id: 2,
                author: {
                    name: 'Laura Bianchi',
                    avatar: 'https://ui-avatars.com/api/?name=Laura+Bianchi&background=random'
                },
                title: 'Dubbio sulla meccanica quantistica',
                content: 'Come si interpreta correttamente il principio di indeterminazione di Heisenberg?',
                category: 'Fisica',
                timestamp: new Date(Date.now() - 14400000), // 4 hours ago
                likes: 15,
                replies: 8
            }
        ];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        try {
            // New discussion button
            const newDiscussionBtn = document.querySelector('button:has(i.fa-plus)');
            if (newDiscussionBtn) {
                newDiscussionBtn.addEventListener('click', () => this.showNewDiscussionModal());
            }

            // Search input
            const searchInput = document.querySelector('.forum-section input[type="search"]');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            }

            // Category filters
            const categoryBtns = document.querySelectorAll('.category-tag');
            categoryBtns.forEach(btn => {
                btn.addEventListener('click', () => this.filterByCategory(btn.textContent.trim()));
            });

            // Post interaction buttons (delegated)
            const postsContainer = document.querySelector('.forum-section .space-y-6');
            if (postsContainer) {
                postsContainer.addEventListener('click', (e) => {
                    const target = e.target.closest('button');
                    if (!target) return;

                    const postId = parseInt(target.closest('[data-post-id]')?.dataset.postId);
                    if (!postId) return;

                    if (target.querySelector('.fa-heart')) {
                        this.handleLike(postId);
                    } else if (target.querySelector('.fa-comment')) {
                        this.showReplyModal(postId);
                    } else if (target.querySelector('.fa-bookmark')) {
                        this.handleBookmark(postId);
                    } else if (target.querySelector('.fa-share-square')) {
                        this.handleShare(postId);
                    }
                });
            }
        } catch (error) {
            console.error('Error initializing forum event listeners:', error);
        }
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Poco fa';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minuti fa`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ore fa`;
        return `${Math.floor(diffInSeconds / 86400)} giorni fa`;
    }

    showNewDiscussionModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-lg">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Nuova Discussione</h3>
                    <button class="text-gray-500 hover:text-gray-700" id="close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="new-discussion-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Titolo
                        </label>
                        <input type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Categoria
                        </label>
                        <select required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">Seleziona categoria</option>
                            <option value="Matematica">Matematica</option>
                            <option value="Fisica">Fisica</option>
                            <option value="Informatica">Informatica</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Contenuto
                        </label>
                        <textarea required rows="4"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" id="cancel-discussion"
                            class="px-4 py-2 text-gray-700 hover:text-gray-900">
                            Annulla
                        </button>
                        <button type="submit"
                            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Pubblica
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        const closeBtn = modal.querySelector('#close-modal');
        const cancelBtn = modal.querySelector('#cancel-discussion');
        const form = modal.querySelector('#new-discussion-form');

        const closeModal = () => document.body.removeChild(modal);

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const newPost = {
                id: this.posts.length + 1,
                author: {
                    name: 'Utente Anonimo', // In a real app, this would be the logged-in user
                    avatar: 'https://ui-avatars.com/api/?name=Anonimo&background=random'
                },
                title: formData.get('title'),
                content: formData.get('content'),
                category: formData.get('category'),
                timestamp: new Date(),
                likes: 0,
                replies: 0
            };

            this.posts.unshift(newPost);
            this.renderPosts();
            closeModal();
        });
    }

    handleSearch(query) {
        query = query.toLowerCase();
        const posts = document.querySelectorAll('.forum-section [data-post-id]');
        posts.forEach(post => {
            const title = post.querySelector('h3').textContent.toLowerCase();
            const content = post.querySelector('p').textContent.toLowerCase();
            const shouldShow = title.includes(query) || content.includes(query);
            post.style.display = shouldShow ? 'block' : 'none';
        });
    }

    filterByCategory(category) {
        const posts = document.querySelectorAll('.forum-section [data-post-id]');
        posts.forEach(post => {
            const postCategory = post.querySelector('.rounded-full').textContent.trim();
            const shouldShow = category === 'Tutti' || postCategory === category;
            post.style.display = shouldShow ? 'block' : 'none';
        });

        // Update active category button
        document.querySelectorAll('.category-tag').forEach(btn => {
            const isActive = btn.textContent.trim() === category;
            btn.classList.toggle('bg-indigo-100', isActive);
            btn.classList.toggle('text-indigo-700', isActive);
            btn.classList.toggle('bg-gray-100', !isActive);
            btn.classList.toggle('text-gray-700', !isActive);
        });
    }

    handleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            this.renderPosts();
        }
    }

    showReplyModal(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-lg">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Rispondi a: ${post.title}</h3>
                    <button class="text-gray-500 hover:text-gray-700" id="close-reply-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="reply-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            La tua risposta
                        </label>
                        <textarea required rows="4"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" id="cancel-reply"
                            class="px-4 py-2 text-gray-700 hover:text-gray-900">
                            Annulla
                        </button>
                        <button type="submit"
                            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Pubblica Risposta
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => document.body.removeChild(modal);

        modal.querySelector('#close-reply-modal').addEventListener('click', closeModal);
        modal.querySelector('#cancel-reply').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        modal.querySelector('#reply-form').addEventListener('submit', (e) => {
            e.preventDefault();
            post.replies++;
            this.renderPosts();
            closeModal();
        });
    }

    handleBookmark(postId) {
        // In a real application, this would save the post to the user's bookmarks
        alert('Post salvato nei preferiti!');
    }

    handleShare(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            // In a real application, this would open a share dialog
            alert(`Condividi: ${post.title}`);
        }
    }

    renderPosts() {
        const container = document.querySelector('.forum-section .space-y-6');
        if (!container) return;

        container.innerHTML = this.posts.map(post => `
            <div class="border-b pb-6 hover:bg-gray-50 p-4 rounded-lg transition duration-150" data-post-id="${post.id}">
                <div class="flex items-center mb-2">
                    <img class="h-10 w-10 rounded-full" src="${post.author.avatar}" alt="${post.author.name}">
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">${post.author.name}</p>
                        <p class="text-sm text-gray-500">${this.formatTimeAgo(post.timestamp)}</p>
                    </div>
                    <span class="ml-3 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        ${post.category}
                    </span>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">${post.title}</h3>
                <p class="text-gray-600">${post.content}</p>
                <div class="mt-3 flex items-center space-x-4">
                    <button class="text-gray-500 hover:text-indigo-600 transition duration-150">
                        <i class="far fa-comment mr-1"></i> ${post.replies} risposte
                    </button>
                    <button class="text-gray-500 hover:text-indigo-600 transition duration-150">
                        <i class="far fa-heart mr-1"></i> ${post.likes}
                    </button>
                    <button class="text-gray-500 hover:text-indigo-600 transition duration-150">
                        <i class="far fa-bookmark mr-1"></i> Salva
                    </button>
                    <button class="text-gray-500 hover:text-indigo-600 transition duration-150">
                        <i class="far fa-share-square mr-1"></i> Condividi
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
