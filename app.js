document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const folderSelect = document.getElementById('folderSelect');
    const createFolderForm = document.getElementById('createFolderForm');
    const folderNameInput = document.getElementById('folderName');
    const parentFolderSelect = document.getElementById('parentFolderSelect');
    const foldersDiv = document.getElementById('folders');

    const apiUrl = 'http://localhost:5095/api/Files';

    const fetchFolders = async () => {
        const response = await fetch(`${apiUrl}/folders`);
        const folders = await response.json();
        folderSelect.innerHTML = '';
        parentFolderSelect.innerHTML = '<option value="">No Parent</option>';
        folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder.id;
            option.textContent = folder.name;
            folderSelect.appendChild(option);
            parentFolderSelect.appendChild(option.cloneNode(true));
        });
        renderFolders(folders);
    };

    const renderFolders = (folders) => {
        foldersDiv.innerHTML = '';
        folders.forEach(folder => {
            const folderElement = document.createElement('div');
            folderElement.innerHTML = `<h3>${folder.name}</h3>`;
            folder.files.forEach(file => {
                const fileElement = document.createElement('div');
                fileElement.textContent = file.fileName;
                folderElement.appendChild(fileElement);
            });
            foldersDiv.appendChild(folderElement);
        });
    };

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        const folderId = folderSelect.value;
        console.log('File:', file);
        console.log('Folder ID:', folderId);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folderId', folderId);

        try {
            const response = await fetch(`${apiUrl}/upload?folderId=`+folderId, {
                method: 'POST',
                body: formData
            });

            console.log('Response:', response);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            fetchFolders();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    createFolderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const folderName = folderNameInput.value;
        const parentFolderId = parentFolderSelect.value || null;

        try {
            const response = await fetch(`${apiUrl}/create-folder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: folderName, parentFolderId: parentFolderId })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            fetchFolders();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    fetchFolders();
});
