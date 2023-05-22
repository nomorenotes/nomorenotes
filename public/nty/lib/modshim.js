const { module, require, modshim } = (() => {
    /** @type {Map<string, any>} */
    const modules = new Map();
    modules.set("", {})
    const require = modules.get.bind(modules);
    let activeModule = ""
    const module = {
        get exports() {
            return modules.get(activeModule)
        },
        set exports(exports) {
            modules.set(activeModule, exports)
        }
    }
    return {
        require, module,
        modshim(name = "") {
            activeModule = name
            if (!modules.has(name)) {
                modules.set(name, {})
            }
        },
    }
})()
