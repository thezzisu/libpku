import { Component } from 'vue'

export interface IToolsAllComponents {
  [key: string]: IToolsComponents
}

export interface IToolsComponents {
  prefix?: string
  components: Record<string, Component>
}

export function defineToolsComponents({
  prefix,
  components
}: IToolsComponents): Record<string, Component> {
  return Object.fromEntries(
    Object.entries(components).map(([key, component]) => [
      prefix ? `${prefix}${key}` : key,
      component
    ])
  )
}
