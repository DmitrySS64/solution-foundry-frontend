import {ICON_PATHS} from "@shared/enum/icons";
import {EColors} from "@shared/enum/colors";
import style from "../style/file_item.module.css";
import Icon from "@mdi/react";
import {Badge} from "@shared/ui/form/badge";
import {IconButton} from "@shared/ui/form/icon_button";
import type {IFileItemProps, ITagProps} from "../interface";

const Tag = ({
    tagName,
    color
}: ITagProps) =>
<Badge size={'small'} light color={color}>
    {tagName}
</Badge>

const FileItem = ({
                      icon = ICON_PATHS.FOLDER_COPY,
                      iconColor = EColors.FOLDER,
                      fileName = "file_name",
                      tags = [
                          {
                              tagName: "Тег 1",
                              color: EColors.SECONDARY
                          },{
                              tagName: "Тег 2",
                              color: EColors.RED
                          },{
                              tagName: "Тег 3",
                              color: EColors.BLUE
                          },{
                              tagName: "Тег 4",
                              color: EColors.GREEN
                          },
                      ],
                      size = '1,2 Гб',
                      lastUpdated = '10.10.2025',
                      onClick
                  }: IFileItemProps) => {
    return(
        <div className={style.item} onClick={onClick}>
            <div className={style.first}>
                <Icon path={icon} size={1} color={iconColor}/>
                {fileName}
            </div>
            <div className={style.tags}>
                {tags?.map((item, key)=>
                    <Tag key={key} tagName={item.tagName} color={item.color}/>
                )}
            </div>
            <div className={style.more}>
                <span>{size}</span>
                <span>{lastUpdated}</span>
                <IconButton path={ICON_PATHS.MORE_VERT}/>
            </div>
        </div>
    )
}

export {FileItem}