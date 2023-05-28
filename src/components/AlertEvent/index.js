import React, { useEffect } from "react";

export const AlertEvent = ({ event, setEvent }) => {
  useEffect(() => {
    // Définir un délai de 3 secondes
    const timeout = setTimeout(() => {
      setEvent(null); // Vider la valeur de l'événement
    }, 3000);

    return () => {
      clearTimeout(timeout); // Nettoyer le délai si le composant est démonté avant l'expiration
    };
  }, [event]);
  return (
    <div className="alert alert-success shadow-lg fixed bottom-4 z-10 left-4  w-3/4 ">
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{event}</span>
      </div>
    </div>
  );
};
