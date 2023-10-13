import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import _ from 'underscore';
import useNetwork from '@hooks/useNetwork';
import * as ReportUtils from '@libs/ReportUtils';
import stylePropTypes from '@styles/stylePropTypes';
import styles from '@styles/styles';
import * as StyleUtils from '@styles/StyleUtils';
import themeColors from '@styles/themes/default';
import CONST from '@src/CONST';
import Icon from './Icon';
import * as Expensicons from './Icon/Expensicons';
import Image from './Image';
import {imagePropTypes} from './Image/imagePropTypes';

const propTypes = {
    /** Source for the avatar. Can be a URL or an icon. */
    source: PropTypes.oneOfType([PropTypes.string, PropTypes.func, imagePropTypes.source]),

    /** Avatar image name required to create the avatar test ID  */
    avatarImageName: PropTypes.string,

    /** Extra styles to pass to Image */
    // eslint-disable-next-line react/forbid-prop-types
    imageStyles: PropTypes.arrayOf(PropTypes.object),

    /** Additional styles to pass to Icon */
    // eslint-disable-next-line react/forbid-prop-types
    iconAdditionalStyles: PropTypes.arrayOf(PropTypes.object),

    /** Extra styles to pass to View wrapper */
    containerStyles: stylePropTypes,

    /** Set the size of Avatar */
    size: PropTypes.oneOf(_.values(CONST.AVATAR_SIZE)),

    /**
     * The fill color for the icon. Can be hex, rgb, rgba, or valid react-native named color such as 'red' or 'blue'
     * If the avatar is type === workspace, this fill color will be ignored and decided based on the name prop.
     */
    fill: PropTypes.string,

    /** A fallback avatar icon to display when there is an error on loading avatar from remote URL.
     * If the avatar is type === workspace, this fallback icon will be ignored and decided based on the name prop.
     */
    fallbackIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.string, imagePropTypes.source]),

    /** Fallback icon name required to create the icon test ID  */
    fallbackIconName: PropTypes.string,

    /** Denotes whether it is an avatar or a workspace avatar */
    type: PropTypes.oneOf([CONST.ICON_TYPE_AVATAR, CONST.ICON_TYPE_WORKSPACE]),

    /** Owner of the avatar. If user, displayName. If workspace, policy name */
    name: PropTypes.string,
};

const defaultProps = {
    avatarImageName: '',
    source: null,
    imageStyles: [],
    iconAdditionalStyles: [],
    containerStyles: [],
    size: CONST.AVATAR_SIZE.DEFAULT,
    fill: themeColors.icon,
    fallbackIcon: Expensicons.FallbackAvatar,
    fallbackIconName: 'FallbackAvatar',
    type: CONST.ICON_TYPE_AVATAR,
    name: '',
};

function Avatar(props) {
    const [imageError, setImageError] = useState(false);
    useNetwork({onReconnect: () => setImageError(false)});

    useEffect(() => {
        setImageError(false);
    }, [props.source]);

    if (!props.source) {
        return null;
    }

    const isWorkspace = props.type === CONST.ICON_TYPE_WORKSPACE;
    const iconSize = StyleUtils.getAvatarSize(props.size);

    const imageStyle =
        props.imageStyles && props.imageStyles.length
            ? [StyleUtils.getAvatarStyle(props.size), ...props.imageStyles, styles.noBorderRadius]
            : [StyleUtils.getAvatarStyle(props.size), styles.noBorderRadius];

    const iconStyle = props.imageStyles && props.imageStyles.length ? [StyleUtils.getAvatarStyle(props.size), styles.bgTransparent, ...props.imageStyles] : undefined;

    const iconFillColor = isWorkspace ? StyleUtils.getDefaultWorkspaceAvatarColor(props.name).fill : props.fill;
    const fallbackAvatar = isWorkspace ? ReportUtils.getDefaultWorkspaceAvatar(props.name) : props.fallbackIcon || Expensicons.FallbackAvatar;

    return (
        <View
            pointerEvents="none"
            style={props.containerStyles}
        >
            {_.isFunction(props.source) || (imageError && _.isFunction(fallbackAvatar)) ? (
                <View style={iconStyle}>
                    <Icon
                        src={imageError ? fallbackAvatar : props.source}
                        height={iconSize}
                        width={iconSize}
                        fill={imageError ? themeColors.offline : iconFillColor}
                        additionalStyles={[
                            StyleUtils.getAvatarBorderStyle(props.size, props.type),
                            isWorkspace ? StyleUtils.getDefaultWorkspaceAvatarColor(props.name) : {},
                            imageError ? StyleUtils.getBackgroundColorStyle(themeColors.fallbackIconColor) : {},
                            ...props.iconAdditionalStyles,
                        ]}
                    />
                </View>
            ) : (
                <View style={[iconStyle, StyleUtils.getAvatarBorderStyle(props.size, props.type), ...props.iconAdditionalStyles]}>
                    <Image
                        source={{uri: imageError ? fallbackAvatar : props.source}}
                        style={imageStyle}
                        onError={() => setImageError(true)}
                    />
                </View>
            )}
        </View>
    );
}
Avatar.defaultProps = defaultProps;
Avatar.propTypes = propTypes;
export default Avatar;
