// Usage: https://feathericons.com/
import feather from "feather-icons";

setTimeout(()=>{
    document.addEventListener("DOMContentLoaded", () => {
        feather.replace();
    });
}, 1000)

window.feather = feather;