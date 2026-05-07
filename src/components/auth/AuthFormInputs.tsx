
import React from "react";
import { Input } from "@/components/ui/input";

interface AuthFormInputsProps {
  isLogin: boolean;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  emailError?: string;
  passwordError?: string;
  usernameError?: string;
}

const AuthFormInputs = ({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  emailError,
  passwordError,
  usernameError
}: AuthFormInputsProps) => {
  return (
    <>
      {!isLogin && (
        <div className="space-y-1">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required={!isLogin}
            minLength={3}
            maxLength={30}
            pattern="^[a-zA-Z0-9_-]+$"
            title="Username can only contain letters, numbers, underscores, and hyphens"
            className={`bg-card/80 border-border backdrop-blur-sm rounded-sm ${
              usernameError ? 'border-destructive focus:border-destructive' : ''
            }`}
          />
          {usernameError && (
            <p className="text-sm text-destructive px-1">{usernameError}</p>
          )}
        </div>
      )}

      <div className="space-y-1">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={`bg-card/80 border-border backdrop-blur-sm rounded-sm ${
            emailError ? 'border-destructive focus:border-destructive' : ''
          }`}
        />
        {emailError && (
          <p className="text-sm text-destructive px-1">{emailError}</p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          showPasswordToggle
          className={`bg-card/80 border-border backdrop-blur-sm rounded-sm ${
            passwordError ? 'border-destructive focus:border-destructive' : ''
          }`}
        />
        {passwordError && (
          <p className="text-sm text-destructive px-1">{passwordError}</p>
        )}
      </div>
    </>
  );
};

export default AuthFormInputs;
