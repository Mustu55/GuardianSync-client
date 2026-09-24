import { useGoogleLogin } from '@react-oauth/google';

/**
 * A custom-styled Google Sign-In button that fits the GuardianSync dark enterprise aesthetic.
 * Uses the useGoogleLogin hook to trigger the Google OAuth popup with our own button design.
 *
 * @param {function} onSuccess - Called with { credential } on successful Google auth
 * @param {function} onError - Called on failure
 * @param {string} text - Button label text (default: 'Continue with Google')
 * @param {boolean} disabled - Disables the button
 */
export default function GoogleAuthButton({
  onSuccess,
  onError,
  text = 'Continue with Google',
  disabled = false,
}) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // tokenResponse contains access_token; fetch the user info then pass credential
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((r) => r.json());
        onSuccess({ access_token: tokenResponse.access_token, userInfo });
      } catch (err) {
        console.error('Google user info fetch failed', err);
        onError?.(err);
      }
    },
    onError: (err) => {
      console.error('Google login failed', err);
      onError?.(err);
    },
    flow: 'implicit',
    scope: 'openid profile email',
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={disabled}
      className="google-auth-btn"
    >
      <span className="google-auth-btn__icon">
        {/* Official Google 'G' SVG */}
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
      </span>
      <span className="google-auth-btn__text">{text}</span>
    </button>
  );
}
