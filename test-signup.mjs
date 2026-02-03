const res = await fetch('http://localhost:8000/api/auth/sign-up/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Teacher Tom',
    email: 'bob@teacher.com',
    password: 'password1234',
    role: 'teacher'
  })
});
console.log('Status:', res.status);
console.log('Body:', await res.text());
process.exit(res.ok ? 0 : 1);
