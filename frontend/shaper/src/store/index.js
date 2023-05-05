import { createStore } from "vuex"
import { msgModule } from "./msgModule"
import { canvasModule } from "./canvasModule"
import { objectModule } from "./objectModule"
import { floorModule } from "./floorModule"
import { uploadModule } from "./uploadModule"

export default createStore({
    modules: {
        messages: msgModule,
        canvasTools: canvasModule,
        object: objectModule,
        floor: floorModule,
        upload: uploadModule
    }
})