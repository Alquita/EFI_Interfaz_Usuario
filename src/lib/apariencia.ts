export const CLAVE_ESTADO = "adoptapp:v1";

/* Script que corre antes del primer pintado: aplica tema, texto grande y movimiento
   reducido guardados, para que no haya parpadeo (ver guía "Preventing flash"). */
export const SCRIPT_APARIENCIA = `(function(){try{var d=document.documentElement,e=JSON.parse(localStorage.getItem("${CLAVE_ESTADO}")||"{}"),t=e.tema||"sistema",a=e.ajustes||{};var o=t==="oscuro"||(t==="sistema"&&matchMedia("(prefers-color-scheme: dark)").matches);d.setAttribute("data-theme",o?"dark":"light");if(a.textoGrande)d.setAttribute("data-text","grande");if(a.reducirMovimiento)d.setAttribute("data-motion","reducido")}catch(x){}})()`;
