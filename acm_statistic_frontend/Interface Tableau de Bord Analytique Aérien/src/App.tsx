import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("JWT_TOKEN");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
  };

  // return (
  //   <Router>
  //     <Routes>
  //       <Route
  //         path="/"
  //         element={
  //           isLoggedIn ? (
  //             <Navigate to="/dashboard" replace />
  //           ) : (
  //             <LoginPage onLogin={handleLogin} />
  //           )
  //         }
  //       />
  //       <Route
  //         path="/dashboard"
  //         element={
  //           isLoggedIn ? (
  //             <Dashboard onLogout={handleLogout} />
  //           ) : (
  //             <Navigate to="/" replace />
  //           )
  //         }
  //       />
  //     </Routes>
  //   </Router>
  // );
  return (
    <div>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}


// import { useState,useEffect } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { LoginPage } from './components/LoginPage';
// import { Dashboard } from './components/Dashboard';

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   useEffect(() => {
//     const storedLogin = localStorage.getItem("isLoggedIn");
//     if (storedLogin === "true") {
//       setIsLoggedIn(true);
//     }
//   }, []);

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//     localStorage.setItem("isLoggedIn", "true"); // Persister
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     localStorage.removeItem("isLoggedIn"); // Supprimer à la déconnexion
//   };


//   return (
//     <div className="size-full">
//       <AnimatePresence mode="wait">
//         {isLoggedIn ? (
//           <motion.div
//             key="dashboard"
//             initial={{ opacity: 0, x: 100 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -100 }}
//             transition={{ 
//               duration: 0.6, 
//               ease: "easeInOut",
//               type: "tween"
//             }}
//             className="h-full"
//           >
//             <Dashboard onLogout={handleLogout} />
//           </motion.div>
//         ) : (
//           <motion.div
//             key="login"
//             initial={{ opacity: 0, x: -100 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: 100 }}
//             transition={{ 
//               duration: 0.6, 
//               ease: "easeInOut",
//               type: "tween"
//             }}
//             className="h-full"
//           >
//             <LoginPage onLogin={handleLogin} />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }