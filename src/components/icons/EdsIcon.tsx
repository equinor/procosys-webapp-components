import {
    attachment,
    menu,
    stop,
    chevron_right,
    chevron_down,
    chevron_up,
    file,
    delete_to_trash,
    arrow_forward,
    arrow_drop_down,
    error_outlined,
    close,
    border_color,
    tune,
    bookmark_outlined,
    bookmark_filled,
    list,
    paste,
    link,
    view_list,
    remove,
    check_circle_outlined,
    arrow_back,
    search,
    warning_outlined,
    warning_filled,
    radio_button_selected,
    radio_button_unselected,
    swap_horizontal,
    arrow_drop_right,
    info_circle,
    checkbox,
    checkbox_outline,
    thumbs_up,
    cloud_download,
    error_filled,
    hourglass_empty,
    check,
    assignment_turned_in,
    external_link,
    tag,
    add,
    launch,
    camera_add_photo,
    download,
    wifi_off,
} from '@equinor/eds-icons';
import { Icon } from '@equinor/eds-core-react';
import React from 'react';

Icon.add({
    camera_add_photo,
    tag,
    attachment,
    external_link,
    menu,
    stop,
    tune,
    file,
    link,
    delete_to_trash,
    cloud_download,
    chevron_right,
    chevron_down,
    chevron_up,
    arrow_drop_down,
    error_outlined,
    close,
    bookmark_outlined,
    bookmark_filled,
    list,
    assignment_turned_in,
    border_color,
    paste,
    view_list,
    remove,
    check_circle_outlined,
    arrow_back,
    arrow_forward,
    search,
    warning_outlined,
    warning_filled,
    radio_button_selected,
    radio_button_unselected,
    swap_horizontal,
    arrow_drop_right,
    info_circle,
    checkbox,
    checkbox_outline,
    thumbs_up,
    error_filled,
    hourglass_empty,
    check,
    add,
    launch,
    download,
    wifi_off,
});

type IconProps = {
    name?: string;
    title?: string;
    color?: string;
    size?: 16 | 24 | 32 | 40 | 48 | undefined;
    quantity?: number;
    alt?: string;
};

const EdsIcon = ({ name, title, color, size }: IconProps): JSX.Element => {
    return <Icon name={name} title={title} color={color} size={size} />;
};

export default EdsIcon;
