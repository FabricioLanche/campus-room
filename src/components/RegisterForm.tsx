import { FormEvent, useState } from 'react';

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
}

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(name, email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-lg">
      <div>
        <label className="block text-sm font-medium text-slate-700">Nombre completo</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Correo institucional</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
          placeholder="tu@universidad.edu"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-secondary/90"
      >
        Registrarse
      </button>
    </form>
  );
};
