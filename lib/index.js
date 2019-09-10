import mTable from "./mTable"

const components = [mTable]

function install(Vue) {
    components.map(component => {
        Vue.component(component.name, component)
    })
}
export { mTable };
export default { mTable };