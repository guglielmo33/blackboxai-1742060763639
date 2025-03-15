// File tree data structure
let fileSystem = [
    {
        id: 1,
        name: "Matematica",
        type: "folder",
        children: [
            {
                id: 2,
                name: "Appunti_Analisi.pdf",
                type: "file",
                extension: "pdf",
                size: "2.5 MB"
            },
            {
                id: 3,
                name: "Esercizi",
                type: "folder",
                children: [
                    {
                        id: 4,
                        name: "Esercizi_Capitolo1.pdf",
                        type: "file",
                        extension: "pdf",
                        size: "1.2 MB"
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        name: "Fisica",
        type: "folder",
        children: [
            {
                id: 6,
                name: "Appunti_Meccanica.pdf",
                type: "file",
                extension: "pdf",
                size: "3.1 MB"
            }
        ]
    }
];

class FileTree {
    constructor() {
        this.files = fileSystem;
        this.currentPath = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Upload button
        const uploadBtn = document.querySelector('button i.fa-upload').parentElement;
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.showUploadModal());
        }

        // Folder click events will be added during rendering
        document.addEventListener('click', (e) => {
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                const id = parseInt(fileItem.dataset.id);
                const type = fileItem.dataset.type;
                
                if (type === 'folder') {
                    this.toggleFolder(id);
                } else {
                    this.previewFile(id);
                }
            }
        });
    }

    getFileIcon(type, extension = '') {
        if (type === 'folder') {
            return 'fas fa-folder text-yellow-500';
        }
        
        switch (extension.toLowerCase()) {
            case 'pdf':
                return 'fas fa-file-pdf text-red-500';
            case 'doc':
            case 'docx':
                return 'fas fa-file-word text-blue-500';
            case 'xls':
            case 'xlsx':
                return 'fas fa-file-excel text-green-500';
            case 'jpg':
            case 'jpeg':
            case 'png':
                return 'fas fa-file-image text-purple-500';
            default:
                return 'fas fa-file text-gray-500';
        }
    }

    findFile(id, files = this.files) {
        for (let file of files) {
            if (file.id === id) return file;
            if (file.children) {
                const found = this.findFile(id, file.children);
                if (found) return found;
            }
        }
        return null;
    }

    toggleFolder(id) {
        const folder = document.querySelector(`.file-item[data-id="${id}"]`);
        const content = folder.nextElementSibling;
        
        if (content && content.classList.contains('folder-content')) {
            const isExpanded = content.classList.contains('block');
            content.classList.toggle('block', !isExpanded);
            content.classList.toggle('hidden', isExpanded);
            
            // Toggle folder icon
            const icon = folder.querySelector('i');
            icon.classList.toggle('fa-folder-open', !isExpanded);
            icon.classList.toggle('fa-folder', isExpanded);
        }
    }

    previewFile(id) {
        const file = this.findFile(id);
        if (!file) return;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-lg">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">
                        <i class="${this.getFileIcon(file.type, file.extension)} mr-2"></i>
                        ${file.name}
                    </h3>
                    <button class="text-gray-500 hover:text-gray-700" id="close-preview">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mb-4">
                    <p class="text-gray-600">Dimensione: ${file.size}</p>
                </div>
                <div class="flex justify-end space-x-3">
                    <button class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" id="download-file">
                        <i class="fas fa-download mr-2"></i>Scarica
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('close-preview').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('download-file').addEventListener('click', () => {
            // In a real application, this would trigger the actual file download
            alert('Download avviato per: ' + file.name);
            document.body.removeChild(modal);
        });
    }

    showUploadModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-lg">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Carica File</h3>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="file">
                        Seleziona un file
                    </label>
                    <input type="file" id="file-upload" class="w-full">
                </div>
                <div class="flex justify-end space-x-3">
                    <button class="px-4 py-2 text-gray-600 hover:text-gray-800" id="cancel-upload">Annulla</button>
                    <button class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" id="submit-upload">
                        Carica
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('cancel-upload').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('submit-upload').addEventListener('click', () => {
            const fileInput = document.getElementById('file-upload');
            if (fileInput.files.length > 0) {
                // In a real application, this would handle the actual file upload
                alert('File caricato con successo: ' + fileInput.files[0].name);
                document.body.removeChild(modal);
            }
        });
    }

    renderFileTree(files = this.files, level = 0) {
        return files.map(file => {
            const indent = level * 1.5; // 1.5rem indentation per level
            const itemHtml = `
                <div class="file-item flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer" 
                     style="padding-left: ${indent}rem"
                     data-id="${file.id}"
                     data-type="${file.type}">
                    <i class="${this.getFileIcon(file.type, file.extension)} mr-3"></i>
                    <span class="text-gray-700">${file.name}</span>
                    ${file.size ? `<span class="text-gray-500 text-sm ml-auto">${file.size}</span>` : ''}
                </div>
            `;

            if (file.type === 'folder' && file.children) {
                return `
                    ${itemHtml}
                    <div class="folder-content hidden">
                        ${this.renderFileTree(file.children, level + 1)}
                    </div>
                `;
            }

            return itemHtml;
        }).join('');
    }

    render() {
        const container = document.querySelector('.space-y-2');
        if (container) {
            container.innerHTML = this.renderFileTree();
        }
    }
}

// Initialize file tree when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const fileTree = new FileTree();
    fileTree.render();
});
