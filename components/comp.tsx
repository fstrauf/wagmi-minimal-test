import React, { Ref, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
// import { cx, css } from '@emotion/css'

interface BaseProps {
  className: string
  [key: string]: unknown
}
type OrNull<T> = T | null

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean
        reversed: boolean
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref}
      className='bg-blue-600'
    />
  )
)

export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<
      {
        value: any
      } & BaseProps
    >,
    ref: Ref<OrNull<null>>
  ) => {
    const textLines = value.document.nodes
      .map(node => node.text)
      .toArray()
      .join('\n')
    return (
      <div
        ref={ref}
        {...props}
        className='m-3'
      >
        <div
        className='text-sm text-gray-800 bg-gray-100 p-5 border-5'

        >
          Slate's value as text
        </div>
        <div
          className="text-gray-800 whitespace-pre-wrap p-4 m-2"
          // {css`
          //   color: #404040;
          //   font: 12px monospace;
          //   white-space: pre-wrap;
          //   padding: 10px 20px;
          //   div {
          //     margin: 0 0 0.5em;
          //   }
          // `}
        >
          {textLines}
        </div>
      </div>
    )
  }
)

export const Icon = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref}
      className='align-text-bottom'
    />
  )
)

export const Instruction = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <div
      {...props}
      ref={ref}
      className='whitespace-pre-wrap text-sm bg-orange-100 p-5 m-4'
    //   className={cx(
    //     className,
    //     css`
          // white-space: pre-wrap;
          // margin: 0 -20px 10px;
          // padding: 10px 20px;
          // font-size: 14px;
          // background: #f8f8e8;
    //     `
    //   )}
    />
  )
)

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <div
      {...props}
      ref={ref}
      className='relative mb-5'
    //   className={cx(
    //     className,
    //     css`
    //       & > * {
    //         display: inline-block;
    //       }

    //       & > * + * {
    //         margin-left: 15px;
    //       }
    //     `
    //   )}
    />
  )
)

export const Portal = ({ children }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => (
    <Menu
      {...props}
      ref={ref}

    //   className={cx(
    //     className,
    //     css`
          // position: relative;
          // padding: 1px 18px 17px;
          // margin: 0 -20px;
          // border-bottom: 2px solid #eee;
          // margin-bottom: 20px;
    //     `
    //   )}
    />
  )
)