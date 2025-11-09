const error = () => {
  throw new Error("Faile to load");
};

beforeAll(() => console.log("Initialization....."));
afterAll(() => console.log("closing....."));

describe("Basic test suite", () => {
  test("Should return true", () => {
    const actual = null;
    const exp = false;
    expect(actual).toBeNull();
  });

  test("Should throw an error", () => {
    expect(() => error()).toThrow();
  });
});

export function forEach(items: number[], callback: any) {
  for (const item of items) {
    callback(item);
  }
}

const mockCallback = jest.fn((x: number) => x * 2);

describe("Mock Functionality", () => {
  test("ForEach mock function", () => {
    forEach([0, 1], mockCallback);
    expect(mockCallback.mock.calls).toHaveLength(2);
  });
  test("calls a callback with correct arguments", () => {
    const mockCallback = jest.fn();

    [1, 2, 3].forEach((num) => mockCallback(num * 2));

    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toHaveBeenCalledWith(2);
    expect(mockCallback).toHaveBeenCalledWith(4);
    expect(mockCallback).toHaveBeenCalledWith(6);
  });

  test("Check function calling functionality", () => {
    const mockFn = jest.fn();
    mockFn();
    mockFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test("Check argument passed to the functionality", () => {
    const mockFn = jest.fn();
    mockFn("data", "studentNames", "staffNames");
    expect(mockFn).toHaveBeenCalledWith("data", "studentNames", "staffNames");
  });

  test("To have bee returned with functionality",()=>{
    const mockfn=jest.fn(x=>x*2)
    mockfn(3)
    expect(mockfn).toHaveReturnedWith(6)
  })
});


