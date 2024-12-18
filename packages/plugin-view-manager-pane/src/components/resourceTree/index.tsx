import { workspace } from '@gant-lowcode/lowcode-engine';
import {
  IPublicModelPluginContext,
  IPublicModelResource,
} from '@gant-lowcode/lowcode-types';
import { Search, Balloon } from '@alifd/next';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { FileIcon, IconArrowRight } from './icon';
import './index.scss';
import { IOptions } from '../..';
import { intl } from '../../locale';
import { AddFile } from '../addFile';

function filterResourceList(resourceList: IPublicModelResource[] | undefined, handler?: Function) {
  if (typeof handler === 'function') {
    return handler(resourceList);
  }

  return resourceList;
}

export function ResourcePaneContent(props: IPluginOptions) {
  const { workspace } = props.pluginContext || {};
  const [resourceList, setResourceList] = useState<IPublicModelResource[] | undefined>(
    filterResourceList(workspace?.resourceList, props?.options?.filterResourceList)
  );
  workspace?.onResourceListChange(() => {
    setResourceList(filterResourceList(workspace?.resourceList, props?.options?.filterResourceList));
  });
  return (
    <ResourceListTree
      resourceList={resourceList}
      defaultExpandedCategoryKeys={props.defaultExpandedCategoryKeys}
      defaultExpandAll={props.defaultExpandAll}
      pluginContext={props.pluginContext}
      behaviors={props.behaviors}
      options={props.options}
    />
  );
}

function ResourceListTree(
  props: {
    resourceList?: IPublicModelResource[];
  } & IPluginOptions
) {
  const [category, setCategory] = useState<{
    [key: string]: IPublicModelResource[];
  }>({});
  const [filterValue, setFilterValue] = useState();
  const [activeId, setActiveId] = useState(
    props.pluginContext?.workspace.window?.resource?.id + ''
  );
  useEffect(() => {
    let category: {
      [key: string]: any;
    } = {};
    props.resourceList?.forEach((d) => {
      category[d.category!] = category[d.category!] || [];
      category[d.category!].push(d);
    });
    setCategory(category);
  }, [props.resourceList]);
  const handleSearchChange = useCallback((key) => {
    setFilterValue(key);
  }, []);
  workspace.onChangeActiveWindow(() => {
    setActiveId(workspace.window?.resource?.id + '');
  });
  return (
    <>
      <div className="resource-tree-filter">
        <Search
          hasClear
          shape="simple"
          placeholder={intl(
            'view_manager.components.resourceTree.SearchPagesAndComponents'
          )}
          className="resource-list-filter-search-input"
          value={filterValue}
          onChange={handleSearchChange}
        />
        <AddFile options={props.options} pluginContext={props.pluginContext} />
      </div>
      <div className="resource-tree">
        {Array.from(Object.entries(category)).map(
          ([categoryName, resourceArr]) => {
            return (
              <ResourceGroup
                defaultExpandAll={props.defaultExpandAll}
                defaultExpandedCategoryKeys={props.defaultExpandedCategoryKeys}
                activeId={activeId}
                categoryName={categoryName}
                resourceArr={resourceArr}
                filterValue={filterValue}
                pluginContext={props.pluginContext}
                behaviors={props.behaviors}
                options={props.options}
                depth={0}
              />
            );
          }
        )}
      </div>
    </>
  );
}

function ResourceGroup(
  props: {
    activeId?: string;
    categoryName: string;
    resourceArr: IPublicModelResource[];
    filterValue?: string;
    depth: number;
  } & IPluginOptions
) {
  const [expanded, setExpanded] = useState(
    props.defaultExpandAll ||
      props.defaultExpandedCategoryKeys?.includes(props.categoryName)
  );
  const resourceArr = props.resourceArr.filter(
    (d) =>
      !props.filterValue ||
      [d.options.title, d.options.slug, d.options.componentName].some(
        (d) => d && d.toLowerCase().includes(props.filterValue?.toLowerCase())
      )
  );

  if (!resourceArr || !resourceArr.length) {
    return null;
  }

  if (!props.categoryName || props.categoryName === 'undefined') {
    return (
      <div
        className="resource-tree-group"
        data-depth={props.depth}
      >
        {resourceArr.map((d) => (
          <ResourceItem
            children={d.children}
            icon={d.icon}
            key={d.title}
            activeId={props.activeId}
            resource={d}
            behaviors={props.behaviors}
            options={props.options}
            pluginContext={props.pluginContext}
            depth={props.depth + 1}
          />
        ))}
      </div>
    );
  }

  const ContextMenu = props.pluginContext?.commonUI?.ContextMenu || React.Fragment;
  const indent = props.depth * 28 + 12;

  const style = {
    paddingLeft: indent,
    marginLeft: -indent,
  }

  return (
    <div
      className="resource-tree-group"
      data-depth={props.depth}
    >
      <ContextMenu
        menus={props.options?.resourceGroupContextMenuActions?.(props.pluginContext!, resourceArr) || []}
      >
        <div
          className='resource-tree-group-wrap'
          style={style}
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <div
            className={`resource-tree-expand ${expanded ? 'expanded' : ''}`}
          >
            <IconArrowRight />
          </div>
          <div className="resource-tree-group-icon">
            <FileIcon />
          </div>
          <div className="resource-tree-group-title">{props.categoryName}</div>
        </div>
      </ContextMenu>
      {expanded && (
        <div className="resource-tree-children">
          {resourceArr.map((d) => (
            <ResourceItem
              children={d.children}
              icon={d.icon}
              key={d.options.id}
              activeId={props.activeId}
              resource={d}
              behaviors={props.behaviors}
              options={props.options}
              pluginContext={props.pluginContext}
              depth={props.depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceItem(props: {
  resource?: IPublicModelResource;
  icon?: any;
  children?: IPublicModelResource[];
  activeId?: string;
  behaviors?: any;
  options?: IOptions;
  pluginContext?: IPublicModelPluginContext;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const PropsIcon = props.icon;
  const Behaviors = props.behaviors;
  const display = (props.resource?.config as any)?.display ?? true;

  const indent = props.depth * 28 + 12;
  const style = {
    paddingLeft: indent,
    marginLeft: -indent,
  }
  if (!display) {
    return null;
  }

  const children = props.children?.filter(d => d.config?.display !== false);
  const {
    disabled,
    tips,
  } = props.resource?.config || {};
  const ContextMenu = props.pluginContext?.commonUI?.ContextMenu || React.Fragment;

  const context = (
    <ContextMenu menus={props.options?.resourceContextMenuActions?.(props.pluginContext!, props.resource!) || []}>
      <div
        ref={ref}
        className={`resource-tree-group-node ${
          disabled
            ? 'resource-tree-group-disabled'
            : ''
        } ${props.activeId === props.resource?.options.id || props.activeId === props.resource?.id ? 'active' : ''}`}
        data-depth={props.depth}
      >
        <div
          onClick={() => {
            if (disabled) {
              return;
            }
            props.resource && props.pluginContext?.workspace.openEditorWindow(props.resource);
          }}
          className="resource-tree-title"
          style={style}
        >
          {props.resource?.options.modified ? (
            <Balloon
              v2
              trigger={<div className='resource-tree-group-item-modified-wrap'><div className="resource-tree-group-item-modified"></div></div>}
              triggerType="hover"
              align='bl'
              title=""
            >
              {props.resource.options.modifiedTips}
            </Balloon>
          ) : null}

          {((children && children.length) || null) && (
            <div
              className={`resource-tree-expand ${expanded ? 'expanded' : ''}`}
              onClick={(e) => {
                setExpanded(!expanded);
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <IconArrowRight />
            </div>
          )}

          <div className="resource-tree-group-item-icon">
            {PropsIcon && <PropsIcon />}
          </div>
          <div className="resource-tree-group-title-label">
            {props.resource?.options?.label || props.resource?.title}

            {
              props.resource?.options?.slug ||
              props.resource?.options?.componentName ? (
                <span className="resource-tree-group-item-code">
                  ({ props.resource.options?.slug || props.resource.options?.componentName })
                </span>
              ) : null
            }
          </div>


          <div className="resource-tree-group-item-behaviors">
            {Behaviors &&
            (props.resource?.config as any)?.disableBehaviors !== true ? (
              <Behaviors
                resource={props.resource}
                safeNode={ref?.current}
              />
            ) : null}
          </div>
        </div>

        {
          expanded && children?.length ? (
            <div className='resource-tree-children'>
              {
                props.children?.map((child) => (
                  <ResourceItem
                    children={child.children}
                    icon={child.icon}
                    key={child.id}
                    activeId={props.activeId}
                    resource={child}
                    behaviors={props.behaviors}
                    options={props.options}
                    pluginContext={props.pluginContext}
                    depth={props.depth + 1}
                  />
                ))
              }
            </div>
          ) : null
        }
      </div>
    </ContextMenu>
  );

  if (tips) {
    return (
      <Balloon
        v2
        trigger={<div>{ context }</div>}
        triggerType="hover"
        align='r'
        title=""
      >
        {tips}
      </Balloon>
    );
  }

  return context;
}

interface IPluginOptions {
  defaultExpandedCategoryKeys?: string[];
  defaultExpandAll?: boolean;
  pluginContext: IPublicModelPluginContext;
  behaviors?: any;
  options: IOptions;
}
