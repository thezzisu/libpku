import { IToolMatcherCtx, defineTools } from './common'
import course from './course'
import disk from './disk'

export const tools = defineTools({
  tools: [...course, ...disk]
})

export async function getEnabledTools(ctx: IToolMatcherCtx): Promise<string[]> {
  const promises = tools
    .map(({ matcher, id }) => [Promise.resolve(matcher?.(ctx)), id] as const)
    .map(([promise, id]) => promise.then((res) => res !== false && id))
  const ids = await Promise.all(promises)
  return ids.filter((c): c is Exclude<typeof c, false> => !!c)
}
