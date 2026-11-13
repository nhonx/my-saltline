/** Generic named registry for extensible game/engine content (props, weapons, enemies, levels, etc.). */
export class ContentRegistry<T> {
  private readonly items = new Map<string, T>();

  register(id: string, entry: T): this {
    this.items.set(id, entry);
    return this;
  }

  has(id: string): boolean {
    return this.items.has(id);
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  names(): string[] {
    return [...this.items.keys()];
  }

  entries(): Array<[string, T]> {
    return [...this.items.entries()];
  }
}

