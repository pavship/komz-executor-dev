import React, { Component, Fragment } from 'react'
import { Auth } from "aws-amplify"
import { Menu, Icon, Label } from 'semantic-ui-react'

export default class NavBar extends Component {
  signOut = () => {
    Auth.signOut()
    window.location.reload()
  }
  render() {
    const { user, sidebarVisible, toggleSidebar, prodCount, mainWorkIsInProgress } = this.props
    return (
      <Menu icon inverted className='komz-navbar' size='small'>
        { user.isDisp ? null :
          <Menu.Menu>
              <Menu.Item
                active={sidebarVisible}
                onClick={toggleSidebar}
                className='komz-navbar-menu-left-item'>
                { !prodCount ? 'Взять в работу' :
                  <Fragment>
                    { mainWorkIsInProgress
                      ? <span className='komz-wt-main-color'>В работе </span>
                      : 'Выбрано '
                    }
                    <Label color='grey' >{prodCount}</Label>
                  </Fragment>
                }
              </Menu.Item>
          </Menu.Menu>
        }
        <Menu.Menu position='right'>
          <Menu.Item name={user.name} />
          <Menu.Item name='sign out' onClick={this.signOut}>
            <Icon name='sign out' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}
