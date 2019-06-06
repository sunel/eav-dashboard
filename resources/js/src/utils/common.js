
export const updateSequence = (collection) => {
    return collection.map((item, index) => {
        return item.set('sequence', index);
    });
};

export const getBreakpoint = (windowWidth, breakpoints) => {
    let result;
    Object.keys(breakpoints)
      .sort((a, b) => {
        const first = breakpoints[a];
        const second = breakpoints[b];
        if (!first) return 1;
        if (!second) return -1;
        if (!first.value) return 1;
        if (!second.value) return -1;
        return first.value - second.value;
      })
      .some(name => {
        const breakpoint = breakpoints[name];
        if (breakpoint) {
          if (!breakpoint.value || breakpoint.value >= windowWidth) {
            result = name;
            return true;
          }
        }
        return false;
      });
    return result;
  };
  
  export const getDeviceBreakpoint = (type, deviceBreakpoints) => deviceBreakpoints[type];
