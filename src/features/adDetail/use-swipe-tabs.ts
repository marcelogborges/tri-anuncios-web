"use client"

import { useRef, type TouchEvent } from "react"

const SWIPE_MIN_DISTANCE = 56
const HORIZONTAL_RATIO = 1.4

// Swipes that start inside a horizontally scrollable area (creative carousel,
// the tab rail itself) belong to that element, not to the tab navigation.
const startedInHorizontalScroller = (target: EventTarget | null) => {
  let node = target instanceof Element ? target : null
  while (node && node !== document.body) {
    if (node.scrollWidth > node.clientWidth + 8) {
      const overflowX = window.getComputedStyle(node).overflowX
      if (overflowX === "auto" || overflowX === "scroll") return true
    }
    node = node.parentElement
  }
  return false
}

type Params = {
  tabs: string[]
  active: string
  enabled: boolean
  onChange: (tab: string) => void
}

export const useSwipeTabs = ({ tabs, active, enabled, onChange }: Params) => {
  const origin = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    if (!enabled || startedInHorizontalScroller(event.target)) {
      origin.current = null
      return
    }
    const touch = event.touches[0]
    origin.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = origin.current
    origin.current = null
    if (!start) return
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    if (Math.abs(deltaX) < SWIPE_MIN_DISTANCE) return
    if (Math.abs(deltaX) < Math.abs(deltaY) * HORIZONTAL_RATIO) return
    const nextIndex = tabs.indexOf(active) + (deltaX < 0 ? 1 : -1)
    if (nextIndex < 0 || nextIndex >= tabs.length) return
    onChange(tabs[nextIndex])
  }

  return { onTouchStart, onTouchEnd }
}
