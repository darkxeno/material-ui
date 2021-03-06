'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');
var StylePropable = require('./mixins/style-propable');
var Transitions = require('./styles/transitions');
var EnhancedSwitch = require('./enhanced-switch');
var RadioButtonOff = require('./svg-icons/toggle/radio-button-unchecked');
var RadioButtonOn = require('./svg-icons/toggle/radio-button-checked');
var DefaultRawTheme = require('./styles/raw-themes/light-raw-theme');
var ThemeManager = require('./styles/theme-manager');

var RadioButton = React.createClass({
  displayName: 'RadioButton',

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },

  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme)
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });
  },

  propTypes: {
    checkedIcon: React.PropTypes.element,
    iconStyle: React.PropTypes.object,
    labelStyle: React.PropTypes.object,
    onCheck: React.PropTypes.func,
    unCheckedIcon: React.PropTypes.element
  },

  getTheme: function getTheme() {
    return this.state.muiTheme.radioButton;
  },

  getStyles: function getStyles() {
    var styles = {
      icon: {
        height: this.getTheme().size,
        width: this.getTheme().size
      },
      target: {
        transition: Transitions.easeOut(),
        position: 'absolute',
        opacity: 1,
        transform: 'scale(1)',
        fill: this.getTheme().borderColor
      },
      fill: {
        position: 'absolute',
        opacity: 1,
        transform: 'scale(0)',
        transformOrigin: '50% 50%',
        transition: Transitions.easeOut(),
        fill: this.getTheme().checkedColor
      },
      targetWhenChecked: {
        opacity: 0,
        transform: 'scale(0)'
      },
      fillWhenChecked: {
        opacity: 1,
        transform: 'scale(1)'
      },
      targetWhenDisabled: {
        fill: this.getTheme().disabledColor
      },
      fillWhenDisabled: {
        fill: this.getTheme().disabledColor
      },
      label: {
        color: this.props.disabled ? this.getTheme().labelDisabledColor : this.getTheme().labelColor
      }
    };

    return styles;
  },

  render: function render() {
    var _props = this.props;
    var checkedIcon = _props.checkedIcon;
    var onCheck = _props.onCheck;
    var unCheckedIcon = _props.unCheckedIcon;

    var other = _objectWithoutProperties(_props, ['checkedIcon', 'onCheck', 'unCheckedIcon']);

    var styles = this.getStyles();
    var onStyles = this.mergeStyles(styles.target, this.props.checked && styles.targetWhenChecked, this.props.iconStyle, this.props.disabled && styles.targetWhenDisabled);
    var offStyles = this.mergeStyles(styles.fill, this.props.checked && styles.fillWhenChecked, this.props.iconStyle, this.props.disabled && styles.fillWhenDisabled);

    var checkedElement = checkedIcon ? React.cloneElement(checkedIcon, {
      style: this.mergeAndPrefix(onStyles, checkedIcon.props.style)
    }) : React.createElement(RadioButtonOn, {
      style: onStyles
    });

    var unCheckedElement = unCheckedIcon ? React.cloneElement(unCheckedIcon, {
      style: this.mergeAndPrefix(offStyles, unCheckedIcon.props.style)
    }) : React.createElement(RadioButtonOff, {
      style: offStyles
    });

    var radioButtonElement = React.createElement(
      'div',
      null,
      unCheckedElement,
      checkedElement
    );

    var rippleColor = this.props.checked ? this.getTheme().checkedColor : this.getTheme().borderColor;

    var iconStyle = this.mergeStyles(styles.icon, this.props.iconStyle);

    var labelStyle = this.mergeStyles(styles.label, this.props.labelStyle);

    var enhancedSwitchProps = {
      ref: "enhancedSwitch",
      inputType: "radio",
      switched: this.props.checked || false,
      switchElement: radioButtonElement,
      rippleColor: rippleColor,
      iconStyle: iconStyle,
      labelStyle: labelStyle,
      onSwitch: this._handleCheck,
      onParentShouldUpdate: this._handleStateChange,
      labelPosition: this.props.labelPosition ? this.props.labelPosition : "right"
    };

    return React.createElement(EnhancedSwitch, _extends({}, other, enhancedSwitchProps));
  },

  // Only called when selected, not when unselected.
  _handleCheck: function _handleCheck(e) {
    if (this.props.onCheck) this.props.onCheck(e, this.props.value);
  },

  _handleStateChange: function _handleStateChange() {},

  isChecked: function isChecked() {
    return this.refs.enhancedSwitch.isSwitched();
  },

  // Use RadioButtonGroup.setSelectedValue(newSelectionValue) to set a
  // RadioButton's checked value.
  setChecked: function setChecked(newCheckedValue) {
    this.refs.enhancedSwitch.setSwitched(newCheckedValue);
  },

  getValue: function getValue() {
    return this.refs.enhancedSwitch.getValue();
  }

});

module.exports = RadioButton;