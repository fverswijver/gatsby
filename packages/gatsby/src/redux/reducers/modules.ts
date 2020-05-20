import { ActionsUnion, IGatsbyState, IDependencyModule } from "../types"

export const modulesReducer = (
  state: IGatsbyState["modules"] = new Map<string, IDependencyModule>(),
  action: ActionsUnion
): IGatsbyState["modules"] => {
  switch (action.type) {
    case `REGISTER_MODULE`: {
      state.set(action.payload.moduleID, { ...action.payload, queryIDs: new Set<String>() })

      return state
    }
    case `CREATE_MODULE_DEPENDENCY`: {
      const dependencyModule = state.get(action.payload.moduleID)

      if (!dependencyModule) {
        throw new Error("[dev] trying to create module dependency without registed module")
      }

      dependencyModule.queryIDs.add(action.payload.path)

      return state
    }
    case `DELETE_COMPONENTS_DEPENDENCIES`: {
      const { modules, paths } = action.payload
      modules.forEach(moduleID => {
        const dependencyModule = state.get(moduleID)
        if (dependencyModule) {
          paths.forEach(path => dependencyModule.queryIDs.delete(path))

          // TO-DO: add handling for forced ones
          if (dependencyModule.queryIDs.size === 0) {
            state.delete(moduleID)
          }
        }


      })

      return state
    }
  }
  return state
}