// const form = document.getElementById('signup-form');
// const email = document.getElementById('email-address');
// const password = document.getElementById('password');

// form.addEventListener('submit', (e) => {
//   async function makeRequest(method, url, callback) {
//     const data = {
//       email: email.value,
//       password: password.value,
//     };
//     const jsonData = JSON.stringify(data);
//     console.log(jsonData)
//     const xhr = new XMLHttpRequest();
//     await xhr.open(method, url);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.onload = function () {
//       callback(null, xhr.response);
//     };
//     xhr.onerror = function () {
//       callback(xhr.response);
//     };
//     xhr.onreadystatechange = function () {
//       if (this.readyState == 4 && this.status == 200) {
//           console.log(this.responseText)
//       }
//     };
//     await xhr.send(jsonData);
//     e.preventDefault();
//   }

//   makeRequest('POST', '/api/user/login', (err, res) => {
//     if (err) throw err;
//     const toObj = JSON.parse(res);
//     const { token } = toObj;
//     localStorage.clear();
//     window.localStorage.setItem('token', token);
//     window.location.href = '/'
//   });
// });


