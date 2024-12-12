import { faker } from '@faker-js/faker';
import { Entity } from '../../../src/domain';

type CustomEntityProps = {
  prop: string;
};

class CustomEntity extends Entity<CustomEntityProps> {}

describe('Entity', () => {
  it('should generate an ID if not provided', () => {
    const prop = faker.word.sample();

    const entity = new CustomEntity({
      prop,
    });

    expect(entity.id).toBeTruthy();
    expect(entity.props.prop).toEqual(prop);
  });

  it('should use the provided ID if provided', () => {
    const prop = faker.word.sample();
    const entity = new CustomEntity({ prop }, 'custom-id');

    expect(entity.id).toEqual('custom-id');
    expect(entity.props.prop).toEqual(prop);
  });

  it('should be able to check equality', () => {
    const prop1 = faker.word.sample();
    const prop2 = faker.word.sample();
    const entityOne = new CustomEntity({ prop: prop1 }, 'same-id');
    const entityTwo = new CustomEntity({ prop: prop2 }, 'same-id');

    class Another {}

    // @ts-expect-error: Testing purposes
    expect(entityOne.equals(null)).toBe(false);
    expect(entityOne.equals(new Another() as any)).toBe(false);

    expect(entityOne.equals(entityOne)).toBe(true);
    expect(entityOne.equals(entityTwo)).toBe(true);
  });
});
