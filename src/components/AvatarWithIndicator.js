import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import * as UserUtils from '@libs/UserUtils';
import styles from '@styles/styles';
import Avatar from './Avatar';
import * as Expensicons from './Icon/Expensicons';
import {imagePropTypes} from './Image/imagePropTypes';
import Indicator from './Indicator';
import Tooltip from './Tooltip';

const propTypes = {
    /** URL for the avatar */
    source: PropTypes.oneOfType([PropTypes.string, PropTypes.func, imagePropTypes.source]).isRequired,

    /** Avatar image name required to create the avatar test ID  */
    avatarImageName: PropTypes.string,

    /** To show a tooltip on hover */
    tooltipText: PropTypes.string,

    /** A fallback avatar icon to display when there is an error on loading avatar from remote URL. */
    fallbackIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.string, imagePropTypes.source]),

    /** Fallback icon name required to create the icon test ID  */
    fallbackIconName: PropTypes.string,
};

const defaultProps = {
    tooltipText: '',
    fallbackIcon: Expensicons.FallbackAvatar,
    fallbackIconName: 'FallbackAvatar',
};

function AvatarWithIndicator(props) {
    return (
        <Tooltip text={props.tooltipText}>
            <View style={[styles.sidebarAvatar]}>
                <Avatar
                    source={UserUtils.getSmallSizeAvatar(props.source)}
                    avatarImageName={props.avatarImageName}
                    fallbackIcon={props.fallbackIcon}
                    fallbackIconName={props.fallbackIconName}
                />
                <Indicator />
            </View>
        </Tooltip>
    );
}

AvatarWithIndicator.defaultProps = defaultProps;
AvatarWithIndicator.propTypes = propTypes;
AvatarWithIndicator.displayName = 'AvatarWithIndicator';

export default AvatarWithIndicator;
