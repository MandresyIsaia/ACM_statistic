import Swal from "sweetalert2";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export class ApiService {
  static async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(BASE_URL + url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur GET:", errorText);
        throw new Error(errorText);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur GET:", error);
      throw error;
    }
  }

  static async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await fetch(BASE_URL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur POST:", errorText);
        throw new Error(errorText);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur POST:", error);
      throw error;
    }
  }
  static async getWithToken<T>(url: string): Promise<T> {
    try {
      const token = sessionStorage.getItem("JWT_TOKEN");
      if (!token) {
        
        window.location.href = "/"; 
        alert("Utilisateur non authentifié");
        throw new Error("Utilisateur non authentifié");
      }
      const response = await fetch(BASE_URL + url, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        // if (response.status === 401 || response.status === 403) {
          
        //   sessionStorage.clear();
        //   window.location.href = "/";
        //   alert("Votre session a expiré. Veuillez vous reconnecter.");
        // }
        if (response.status === 401 || response.status === 403) {
          sessionStorage.clear();
          Swal.fire({
            icon: "warning",
            title: "Session expirée",
            text: "Votre session a expiré. Veuillez vous reconnecter.",
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
            backdrop: true,
            allowOutsideClick: false,
            allowEscapeKey: false, // empêche la fermeture avec Échap
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
        }
        else{
          const errorText = await response.text();
          console.error("Erreur GET:", errorText);
          alert("Erreur : " + errorText);
          throw new Error(errorText);
        }

      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur GET:", error);
      throw error;
    }
  }
  static async postWithToken<T>(url: string, data: any): Promise<T> {
    try {
      const token = sessionStorage.getItem("JWT_TOKEN");
      if (!token) {
        window.location.href = "/";
        alert("Utilisateur non authentifié");
        throw new Error("Utilisateur non authentifié");
      }
      const response = await fetch(BASE_URL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          
          sessionStorage.clear();
          window.location.href = "/";
          alert("Votre session a expiré. Veuillez vous reconnecter.");
        }else{
          const errorText = await response.text();
          console.error("Erreur POST:", errorText);
          alert("Erreur : " + errorText);
          throw new Error(errorText);
        }

      }

      return await response.json();
    } catch (error) {
      console.error("Erreur POST:", error);
      throw error;
    }
  }
}
