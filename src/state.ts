import deepEqual from 'fast-deep-equal'
import { atom } from 'jotai'
import { atomFamily, atomWithDefault } from 'jotai/utils'

import { lightColorspace } from './theme/base16'
import type { HoverPath, JsonViewerKeyRenderer, JsonViewerState, TypeRegistryState } from './type'

const DefaultKeyRenderer: JsonViewerKeyRenderer = () => null
DefaultKeyRenderer.when = () => false

export const collapseStringsAfterLengthAtom = atom<JsonViewerState['collapseStringsAfterLength']>(50)
export const colorspaceAtom = atom<JsonViewerState['colorspace']>(lightColorspace)
export const defaultInspectDepthAtom = atom<JsonViewerState['defaultInspectDepth']>(5)
export const displayDataTypesAtom = atom<JsonViewerState['displayDataTypes']>(true)
export const displayObjectSizeAtom = atom<JsonViewerState['displayObjectSize']>(true)
export const enableClipboardAtom = atom<JsonViewerState['enableClipboard']>(true)
export const editableAtom = atom<JsonViewerState['editable']>(false)
export const groupArraysAfterLengthAtom = atom<JsonViewerState['groupArraysAfterLength']>(100)
export const indentWidthAtom = atom<JsonViewerState['indentWidth']>(3)
export const keyRendererAtom = atom<JsonViewerState['keyRenderer']>(DefaultKeyRenderer)
export const maxDisplayLengthAtom = atom<JsonViewerState['maxDisplayLength']>(30)
export const onChangeAtom = atom<JsonViewerState['onChange']>(() => {})
export const onCopyAtom = atom<JsonViewerState['onCopy']>(() => {})
export const rootNameAtom = atom<JsonViewerState['rootName']>('root')
export const objectSortKeysAtom = atom<JsonViewerState['objectSortKeys']>(false)
export const quotesOnKeysAtom = atom<JsonViewerState['quotesOnKeys']>(true)
export const inspectCacheAtom = atom<JsonViewerState['inspectCache']>({})
export const hoverPathAtom = atom<JsonViewerState['hoverPath'] | null>(null)
export const registryAtom = atom<TypeRegistryState['registry']>([])
export const valueAtom = atom<JsonViewerState['value'] | undefined>(undefined)

/* TODO add type to atom */
export const getInspectCacheAtom = atomFamily(({ path, nestedIndex }: HoverPath) => atomWithDefault(
  (get) => {
    const target = nestedIndex === undefined
      ? path.join('.')
      : `${path.join('.')}[${nestedIndex}]nt`
    return get(inspectCacheAtom)[target]
  }
), deepEqual)
// export const getInspectCacheAtom = atom(({ path, nestedIndex }: HoverPath) => atom<boolean>(
//   (get) => {
//     const target = nestedIndex === undefined
//       ? path.join('.')
//       : `${path.join('.')}[${nestedIndex}]nt`
//     return get(inspectCacheAtom)[target]
//   }
// ), deepEqual)

export const setInspectCacheAtom = atom(
  (get) => get(inspectCacheAtom),
  (get, set, { path, action, nestedIndex }) => {
    const target = nestedIndex === undefined
      ? path.join('.')
      : `${path.join('.')}[${nestedIndex}]nt`
    const inspectCache = get(inspectCacheAtom)
    return set(inspectCacheAtom, {
      ...inspectCache,
      [target]: typeof action === 'function'
        ? action(inspectCache[target])
        : action
    })
  }
)
export const setHoverAtom = atom(
  (get) => get(hoverPathAtom),
  (_get, set, { path, nestedIndex }) => set(hoverPathAtom, path
    ? { path, nestedIndex }
    : null
  )
)

export const registryTypesAtom = atom(
  (get) => get(registryAtom),
  (get, set, setState) => {
    if (typeof setState === 'function') {
      return setState(get(registryAtom))
    }
    return set(registryAtom, setState)
  }
)
