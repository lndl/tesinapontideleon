import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

import { Link } from 'react-router-dom'

export default class FFMenu extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu inverted style={{ borderRadius: 0 }}>
        <Link to="/">
          <Menu.Item as='span' name='certifications' active={activeItem === 'certifications'} onClick={this.handleItemClick}>
            Certificaciones
          </Menu.Item>
        </Link>

        <Link to="/new_certification">
          <Menu.Item as='span' name='new_certification' active={activeItem === 'new_certification'} onClick={this.handleItemClick}>
            Nueva certificación
          </Menu.Item>
        </Link>
      </Menu>
    )
  }
}
