import Figure from './Figure'

export class Z extends Figure {
  color = '#4381ff'

  constructor() {
    super(['## ', ' ##', '   '])
  }
}

export class Z2 extends Figure {
  color = '#ff6a28'

  constructor() {
    super([' ##', '## ', '   '])
  }
}

export class O extends Figure {
  color = '#ff59cd'

  constructor() {
    super(['##', '##'])
  }
}

export class L extends Figure {
  color = '#b3ff56'

  constructor() {
    super(['#  ', '#  ', '## '])
  }
}

export class L2 extends Figure {
  color = '#29c8ab'

  constructor() {
    super(['  #', '  #', ' ##'])
  }
}

export class I extends Figure {
  color = '#ff1546'

  constructor() {
    super(['#   ', '#   ', '#   ', '#   '])
  }
}

export class T extends Figure {
  color = '#9757ff'

  constructor() {
    super(['   ', '###', ' # '])
  }
}
