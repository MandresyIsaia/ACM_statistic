import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
// import { Plane } from 'lucide-react';
import logo from '../assets/LOGO.png';
import { UtilisateurDTO } from '../models/utilisateurs/UtilisateurDTO';
import { ApiService } from '../services/ApiService';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.preventDefault();
    setIsLoading(true);
    const userLogin = new UtilisateurDTO({
      userCode: email,
      userPasswordString: password
    });
    
    if (!userLogin.isValid()) {
      setMessage("Veuillez remplir tous les champs");
      return;
    }
    
    try {
      const result = await ApiService.post<{ token: string; utilisateur: UtilisateurDTO }>("Utilisateur/login",userLogin);
      sessionStorage.setItem("JWT_TOKEN", result.token);
		sessionStorage.setItem("USER_INFO", JSON.stringify(result.utilisateur));

      onLogin();
    } catch (error) {
      console.error(error);
      setMessage((error as Error).message || "Erreur inconnue");

      console.log((error as Error).message)
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
          >
            {/* <Plane className="w-8 h-8 text-white" /> */}
            <img 
                src={logo}
                alt="Logo" 
                className="w-16 h-16"
              />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            ACM Statistics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600"
          >
            Module d'analyse et statistique
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Connexion</CardTitle>
                <CardDescription className="text-center">
                  Entrez vos identifiants pour accéder au portail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Code d'utilisateur</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="000XXX"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white pr-10" // espace à droite pour l’icône
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
              {message && (
              <p className="text-red-600 text-sm font-medium">{message}</p>
            )}
          </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <motion.div
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </motion.div>
                {/* <motion.a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Mot de passe oublié ?
                </motion.a> */}
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          © {new Date().getFullYear()} ACM. Tous droits réservés.
        </motion.div>
      </motion.div>
    </div>
  );
}