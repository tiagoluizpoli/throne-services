export type MappingPropertyArray = {
  type: 'array';
  sourcePath: string[];
  items?: Mapping;
};

export type MappingPropertyObject = {
  type: 'object';
  sourcePath: string[];
  properties: Mapping;
};

export type MappingPropertyPrimitive = {
  type: 'string' | 'number' | 'boolean';
  sourcePath: string[];
};

export type MappingProperty = MappingPropertyArray | MappingPropertyObject | MappingPropertyPrimitive;

export type Mapping = Record<string, MappingProperty>;

export class SchemaParser {
  private sourcePathJoiner = (path: string[], mappingPrefix?: string): string => {
    return `${mappingPrefix ? `${mappingPrefix}.` : ''}${path.map((sp) => (sp.includes(' ') ? `"${sp}"` : sp)).join('.')}`;
  };

  private primitiveStringParser = (key: string, sourcePath: string[], mappingPrefix?: string): string => {
    return `"${key}":${this.sourcePathJoiner(sourcePath, mappingPrefix)}`;
  };

  private arrayStringParser = (key: string, sourcePath: string[], items?: Mapping, mappingPrefix?: string): string => {
    if (!items) {
      return `"${key}": ${this.sourcePathJoiner(sourcePath, mappingPrefix)}`;
    }
    return `"${key}": $map(${this.sourcePathJoiner(sourcePath, mappingPrefix)}, function($v){${this.buildJSONataMapping(items, '$v')}})`;
  };

  buildJSONataMapping = (mapping: Mapping, mappingPrefix?: string): string => {
    const keys = Object.keys(mapping);
    const result: string[] = [];
    for (const key of keys) {
      if (['string', 'number', 'boolean'].includes(mapping[key].type)) {
        result.push(this.primitiveStringParser(key, mapping[key].sourcePath, mappingPrefix));
      }

      if (mapping[key].type === 'array') {
        result.push(this.arrayStringParser(key, mapping[key].sourcePath, mapping[key].items, mappingPrefix));
      }

      if (mapping[key].type === 'object') {
        result.push(
          `"${key}": ${this.buildJSONataMapping(mapping[key].properties, this.sourcePathJoiner(mapping[key].sourcePath, mappingPrefix))}`,
        );
      }
    }
    return `{${result.join(',')}}`;
  };
}
