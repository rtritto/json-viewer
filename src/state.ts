import deepEqual from 'fast-deep-equal'
import { atom } from 'jotai'
import { atomFamily, atomWithDefault } from 'jotai/utils'

import { lightColorspace } from './theme/base16'
import type { HoverPath, JsonViewerState, TypeRegistryState } from './type'

export const valueAtom = atom<JsonViewerState['value'] | undefined>(undefined)
export const editableAtom = atom<JsonViewerState['editable'] | undefined>(undefined)
export const indentWidthAtom = atom<JsonViewerState['indentWidth'] | undefined>(undefined)
export const onChangeAtom = atom<JsonViewerState['onChange'] | undefined>(undefined)
export const groupArraysAfterLengthAtom = atom<JsonViewerState['groupArraysAfterLength'] | undefined>(undefined)
export const keyRendererAtom = atom<JsonViewerState['keyRenderer'] | undefined>(undefined)
export const maxDisplayLengthAtom = atom<JsonViewerState['maxDisplayLength'] | undefined>(undefined)
export const enableClipboardAtom = atom<JsonViewerState['enableClipboard'] | undefined>(undefined)
export const rootNameAtom = atom<JsonViewerState['rootName'] | undefined>(undefined)
export const displayDataTypesAtom = atom<JsonViewerState['displayDataTypes'] | undefined>(undefined)
export const displayObjectSizeAtom = atom<JsonViewerState['displayObjectSize'] | undefined>(undefined)
export const onCopyAtom = atom<JsonViewerState['onCopy'] | undefined>(undefined)
export const colorspaceAtom = atom<JsonViewerState['colorspace']>(lightColorspace)
export const collapseStringsAfterLengthAtom = atom<JsonViewerState['collapseStringsAfterLength'] | undefined>(undefined)
export const defaultInspectDepthAtom = atom<JsonViewerState['defaultInspectDepth'] | undefined>(undefined)
export const objectSortKeysAtom = atom<JsonViewerState['objectSortKeys'] | undefined>(undefined)
export const quotesOnKeysAtom = atom<JsonViewerState['quotesOnKeys'] | undefined>(undefined)
export const inspectCacheAtom = atom<JsonViewerState['inspectCache']>({})
export const hoverPathAtom = atom<JsonViewerState['hoverPath'] | null>(null)
export const registryAtom = atom<TypeRegistryState['registry']>([])

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
// 	(get) => {
// 		const target = nestedIndex === undefined
//       ? path.join('.')
//       : `${path.join('.')}[${nestedIndex}]nt`
//     return get(inspectCacheAtom)[target]
// 	}
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