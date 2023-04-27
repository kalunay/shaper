import { createStore } from "vuex";
import { msgModule } from "./msgModule";

export default createStore({
    modules: {
        messages: msgModule
    }
})