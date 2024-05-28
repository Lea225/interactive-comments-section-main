document.addEventListener('DOMContentLoaded', () => {
    const commentsSection = document.querySelector('.comment-section');
    const deleteModal = document.querySelector('.delete-modal');
    const cancelDeleteButton = document.querySelector('.cancel-btn');
    const confirmDeleteButton = document.querySelector('.delete-btn');
    const currentUser = {
        username: 'juliusomo',
        image: {
            png: './images/avatars/image-juliusomo.png'
        }
    };

    function addComment(content, parentCommentId = null) {
        const newComment = {
            id: Date.now(),
            content: content,
            createdAt: 'Just now',
            score: 0,
            user: currentUser,
            replies: []
        };
        const commentElement = createCommentElement(newComment);
        if (parentCommentId) {
            const parentComment = commentsSection.querySelector(`[data-id="${parentCommentId}"]`);
            parentComment.insertAdjacentElement('afterend', commentElement);
        } else {
            commentsSection.appendChild(commentElement);
        }
    }

    function createCommentElement(comment) {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.dataset.id = comment.id;
    
        const voteButtons = document.createElement('div');
        voteButtons.classList.add('vote-buttons');
        voteButtons.innerHTML = `
            <button class="upvote-btn">
                <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"/></svg>
            </button>
            <span class="vote-score">${comment.score}</span>
            <button class="downvote-btn">
                <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"/></svg>
            </button>
        `;
    
        const commentContent = document.createElement('div');
        commentContent.classList.add('comment-content');
    
        const commentHeader = document.createElement('div');
        commentHeader.classList.add('comment-header');
    
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar-div');
        avatarDiv.innerHTML = `
            <img class="avatar-img" src="${comment.user.image.png}" alt="${comment.user.username}'s avatar">
            <strong>${comment.user.username}</strong>
            <span>${comment.createdAt}</span>
        `;
    
        const actionButtons = document.createElement('div');
        actionButtons.classList.add('action-buttons');
    
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('newCom-delete-btn');
        deleteButton.innerHTML = `<img src="images/icon-delete.svg" alt="icon-delete">Delete`;
    
        const editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.innerHTML = `<img src="images/icon-edit.svg" alt="icon-edit">Edit`;

        actionButtons.appendChild(deleteButton);
        actionButtons.appendChild(editButton);
    
        const commentBody = document.createElement('div');
        commentBody.classList.add('comment-body');
        commentBody.textContent = comment.content;

        const commentFooter = document.createElement('div');
        commentFooter.classList.add('comment-footer');

        const isMobile = window.innerWidth <= 768; // Vous pouvez ajuster cette valeur selon vos besoins

        if (isMobile) {
        commentFooter.appendChild(voteButtons);
        commentFooter.appendChild(actionButtons);
        }
        else{
            avatarDiv.appendChild(actionButtons);
            commentElement.appendChild(voteButtons);
        }
        commentHeader.appendChild(avatarDiv);
    
        commentContent.appendChild(commentHeader);
        commentContent.appendChild(commentBody);
        commentContent.appendChild(commentFooter);
    
        commentElement.appendChild(commentContent);
    
        // Ajout du conteneur pour les réponses
        const replyDiv = document.createElement('div');
        replyDiv.classList.add('reply-div');
        commentElement.appendChild(replyDiv);
    
        return commentElement;
    }    

    commentsSection.addEventListener('click', (e) => {
        if (e.target.closest('.reply-btn')) {
            const commentElement = e.target.closest('.comment');
            const existingReplyForm = commentElement.querySelector('.add-comment');
            if (existingReplyForm) existingReplyForm.remove();
            addReplyForm(commentElement);
        }

        if (e.target.closest('.send-comment-btn')) {
            const commentForm = e.target.closest('.add-comment');
            const textarea = commentForm.querySelector('textarea');
            const errorMessage = commentForm.querySelector('.error-message');
            const content = textarea.value.trim();
            if (content !== '') {
                const parentCommentId = commentForm.dataset.parentId;
                addComment(content, parentCommentId);
                textarea.value = '';
                if (errorMessage) errorMessage.classList.add('hidden');
                textarea.classList.remove('error-input');
                commentForm.remove();
            } else {
                if (errorMessage) errorMessage.classList.remove('hidden');
                textarea.classList.add('error-input');
            }
        }        

        if (e.target.closest('.newCom-delete-btn')) {
            const commentElement = e.target.closest('.comment');
            const commentId = commentElement.dataset.id;
            deleteModal.dataset.commentId = commentId;
            deleteModal.style.display = 'flex';
        }

        if (e.target.closest('.edit-btn')) {
            const commentElement = e.target.closest('.comment');
            const commentBody = commentElement.querySelector('.comment-body');
            const originalContent = commentBody.textContent.trim();
            commentBody.innerHTML = `
                
                <div class="textarea-div">
                <textarea class="edit-textarea">${originalContent}</textarea>
                    <div>
                    <button class="update-edit-btn">UPDATE</button>
                    <button class="cancel-edit-btn">CANCEL</button>
                    </div>
                </div>
            `;
        }

        if (e.target.closest('.update-edit-btn')) {
            const commentElement = e.target.closest('.comment');
            const textarea = commentElement.querySelector('.edit-textarea');
            const newContent = textarea.value.trim();
            const commentBody = commentElement.querySelector('.comment-body');
            if (newContent !== '') {
                commentBody.textContent = newContent;
            }
        }

        if (e.target.closest('.cancel-edit-btn')) {
            const commentElement = e.target.closest('.comment');
            const commentBody = commentElement.querySelector('.comment-body');
            const originalContent = commentBody.querySelector('.edit-textarea').value;
            commentBody.textContent = originalContent;
        }

        if (e.target.closest('.upvote-btn')) {
            const commentElement = e.target.closest('.comment');
            const scoreElement = commentElement.querySelector('.vote-score');
            let score = parseInt(scoreElement.textContent);
            scoreElement.textContent = ++score;
        }

        if (e.target.closest('.downvote-btn')) {
            const commentElement = e.target.closest('.comment');
            const scoreElement = commentElement.querySelector('.vote-score');
            let score = parseInt(scoreElement.textContent);
            scoreElement.textContent = --score;
        }
    });

    function addReplyForm(commentElement) {
        const addCommentForm = document.createElement('div');
        addCommentForm.classList.add('add-comment');
        addCommentForm.dataset.parentId = commentElement.dataset.id;
        addCommentForm.innerHTML = `
            <img src="./images/avatars/image-juliusomo.png" alt="User avatar" class="user-avatar">
            <textarea placeholder="Add a comment..."></textarea>
            <button class="send-comment-btn">SEND</button>
            <p class="error-message hidden" style="color: red;">Message cannot be empty</p>
        `;
        commentElement.insertAdjacentElement('afterend', addCommentForm);

        const textarea = addCommentForm.querySelector('textarea');
        textarea.addEventListener('input', () => {
            if (textarea.value.trim() !== '') {
                textarea.classList.add('typing');
            } else {
                textarea.classList.remove('typing');
            }
        });
    }

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    confirmDeleteButton.addEventListener('click', () => {
        const commentIdToDelete = deleteModal.dataset.commentId;
        const commentElement = commentsSection.querySelector(`[data-id="${commentIdToDelete}"]`);
        if (commentElement) commentElement.remove();
        deleteModal.style.display = 'none';
    });

    const mainAddCommentForm = document.querySelector('.add-comment');
    if (mainAddCommentForm) {
        const mainTextarea = mainAddCommentForm.querySelector('textarea');
        const mainErrorMessage = mainAddCommentForm.querySelector('.error-message');
        const mainSendButton = mainAddCommentForm.querySelector('.send-btn');

        mainSendButton.addEventListener('click', () => {
            const content = mainTextarea.value.trim();
            if (content !== '') {
                addComment(content);
                mainTextarea.value = '';
                if (mainErrorMessage) mainErrorMessage.classList.add('hidden');
                mainTextarea.classList.remove('error-input');
            } else {
                if (mainErrorMessage) mainErrorMessage.classList.remove('hidden');
                mainTextarea.classList.add('error-input');
            }
        });

        mainTextarea.addEventListener('input', () => {
            if (mainTextarea.value.trim() !== '') {
                mainTextarea.classList.add('typing');
                if (mainErrorMessage) mainErrorMessage.classList.add('hidden');
                mainTextarea.classList.remove('error-input');
            } else {
                mainTextarea.classList.remove('typing');
            }
        });
    }

    document.querySelectorAll('.upvote-btn').forEach(button => {
        button.addEventListener('click', () => {
          const voteScoreElement = button.nextElementSibling;
          let currentScore = parseInt(voteScoreElement.textContent, 10);
          voteScoreElement.textContent = currentScore + 1;
        });
      });
    
      document.querySelectorAll('.downvote-btn').forEach(button => {
        button.addEventListener('click', () => {
          const voteScoreElement = button.previousElementSibling;
          let currentScore = parseInt(voteScoreElement.textContent, 10);
          if (currentScore > 0) {
            voteScoreElement.textContent = currentScore - 1;
          }
        });
    });
});
