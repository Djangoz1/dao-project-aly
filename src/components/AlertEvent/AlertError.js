import React, { useEffect } from "react";

export const AlertError = ({ error, setError }) => {
  useEffect(() => {
    // Définir un délai de 3 secondes
    const timeout = setTimeout(() => {
      setError(null); // Vider la valeur de l'événement
    }, 3000);

    return () => {
      clearTimeout(timeout); // Nettoyer le délai si le composant est démonté avant l'expiration
    };
  }, [error]);
  return (
    <div className="alert alert-error shadow-lg fixed bottom-4 z-10 left-4  w-[90vw] ">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error! Something went wrong with call {error}</span>
      </div>
    </div>
  );
};
