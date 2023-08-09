document.addEventListener('DOMContentLoaded', (event) => {
  if (event) {
    console.info('DOM loaded');
  }

  const commentsDiv = document.querySelector('.comments');
  if (commentsDiv) {
    const postId = commentsDiv.getAttribute('data-post-id');
    fetchComments(postId);
  }
  

  function fetchComments(postId) {
    fetch(`/api/comments/post/${postId}`)
        .then((response) => response.json())
        .then((comments) => {
            commentsDiv.innerHTML = '';

            comments.forEach((comment) => {
                const commentElement = createCommentElement(comment);
                commentsDiv.appendChild(commentElement);
            });
        })
        .catch((error) => console.error('Error:', error));
  }


    function handleEditPost(event) {
        event.preventDefault();
        const form = document.querySelector('#edit-post-form');
        const postId = form.getAttribute('data-post-id');
        const title = form.querySelector('input[name="title"]').value;
        const content = form.querySelector('textarea[name="content"]').value;
      
        fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          body: JSON.stringify({ title, content }),
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            window.location.replace(data.redirectURL);
          } else {
            alert(data.message);
          }
        })
        .catch((error) => console.error('Error:', error));
      }
  
      function handleLogin(event) {
        event.preventDefault();
        const username = document.querySelector('#login-username').value;
        const password = document.querySelector('#login-password').value;
    
        fetch('/api/users/login', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              window.location.replace(data.redirectURL);
            } else {
              alert(data.message);
            }
          })
          .catch((error) => console.error('Error:', error));
      }
    
      function handleSignup(event) {
        event.preventDefault();
        const username = document.querySelector('#signup-username').value;
        const email = document.querySelector('#signup-email').value;
        const password = document.querySelector('#signup-password').value;
    
        fetch('/api/users/signup', {
          method: 'POST',
          body: JSON.stringify({ username, email, password }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              window.location.replace(data.redirectURL);
            } else {
              alert(data.message);
            }
          })
          .catch((error) => console.error('Error:', error));
      }
  
    function handleNewPost(event) {
      event.preventDefault();
      const title = document.querySelector('#post-title').value;
      const content = document.querySelector('#post-content').value;
  
      fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.replace(data.redirectURL);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error('Error:', error));
    }
    
    function createCommentElement(comment) {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment';

      const commentByP = document.createElement('p');
      commentByP.textContent = comment.User.username + ' commented:';
      commentDiv.appendChild(commentByP);

      const commentContentP = document.createElement('h4');
      commentContentP.textContent = comment.comment_text;
      commentDiv.appendChild(commentContentP);

      const commentDateP = document.createElement('p');
      commentDateP.textContent = 'Posted on ' + new Date(comment.com_date_created).toLocaleDateString();
      commentDiv.appendChild(commentDateP);

      return commentDiv;
  }

  function handleNewComment(event) {
    event.preventDefault();
    const postId = event.target.querySelector('input[name="post_id"]').value;
    const content = event.target.querySelector('textarea[name="comment_text"]').value;

    fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ post_id: postId, comment_text: content }),
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((data) => {
            // Call fetchComments to make sure the displayed comments are up to date
            fetchComments(postId);
        })
        .catch((error) => console.error('Error:', error));
  }

  
document.querySelectorAll('form[action="/api/comments"]').forEach((form) => {
  form.addEventListener('submit', handleNewComment);
});
  

const editPostForm = document.querySelector('#edit-post-form');
if (editPostForm) {
  editPostForm.addEventListener('submit', handleEditPost);
}

const loginForm = document.querySelector('#login-form');
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

const signupForm = document.querySelector('#signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', handleSignup);
}

const newPostForm = document.querySelector('#new-post-form');
if (newPostForm) {
  newPostForm.addEventListener('submit', handleNewPost);
}

  });
  