export type EventHandler<T = any> = (payload: T) => void;

export interface EventBus {
  on<K extends string>(event: K, handler: EventHandler<any>): () => void;
  off<K extends string>(event: K, handler: EventHandler<any>): void;
  emit<K extends string>(event: K, payload?: any): void;
}

/** Synchronous pub/sub event bus with per-handler error isolation. */
export function createEventBus(): EventBus {
  const listeners = new Map<string, EventHandler[]>();
  return {
    on(event, handler) {
      let list = listeners.get(event);
      if (!list) {
        list = [];
        listeners.set(event, list);
      }
      list.push(handler);
      return () => this.off(event, handler);
    },
    off(event, handler) {
      const list = listeners.get(event);
      if (!list) return;
      const idx = list.indexOf(handler);
      if (idx >= 0) list.splice(idx, 1);
    },
    emit(event, payload) {
      const list = listeners.get(event);
      if (!list) return;
      for (let i = 0; i < list.length; i++) {
        try {
          list[i](payload);
        } catch (err) {
          console.error(`[events] handler for "${event}" threw`, err);
        }
      }
    },
  };
}

