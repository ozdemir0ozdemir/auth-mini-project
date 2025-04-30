import { AuthProvider } from "./AuthContext";
import LoginForm from "./LoginForm";
import { apiFetch } from "./Api";

const API_URL = "http://localhost:8080/api/v1";

function App() {

  async function handleMeClick() {
    try {
      const res = await apiFetch('/auth/me');
      const text = await res.text();
      alert(text);
    } catch (err) {
      alert('Failed to fetch user info');
    }
  }

  async function handleLogoutClick() {
    await fetch(API_URL  + '/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    window.location.reload();
  }

  return (
      <AuthProvider>
        <div style={{ padding: 20 }}>
          <LoginForm />
          <hr />
          <button onClick={handleMeClick}>Me</button>
          <button onClick={handleLogoutClick}>Logout</button>
        </div>
      </AuthProvider>
  );
}

export default App;
