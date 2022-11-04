# 页面元素标记组件
这是一个前置插件，本身不提供功能，需要与其他插件配合使用

## 开发指南
### 暴露接口
本程序在全局作用域（window）中暴露了UI_control对象。

>
> UI_control
>
> |-t2i:array//存放了文转图的所有控件
>
> |-i2i:array//存放了图转图的所有控件
>
> |-t2i_select:object//存放了文转图的标签名字对应的控件
>
> |-i2i_select:object//存放了图转图的标签名字对应的控件
>
> |-get(DomElement)->
>string :function//获取控件值
>
> |-set(DomElement,String|Integer|Boolean)->
>undefined :function//设置控件值。该操作会触发change事件和input事件

#### 例子
```javascript
UI_control.set(UI_control.t2i_select['Prompt'],1)//设置文转图Prompt
UI_control.set(UI_control.t2i_select['DDIM'],1)//设置文转图的采样器为DDIM
```
### 可用的全部值
**仅仅是程序试图寻找的控件（不一定存在，仅供参考）**

>
> Euler a
>
> Euler
>
> LMS
>
> Heun
>
> DPM2
>
> DPM2 a
>
> DPM fast
>
> DPM adaptive
>
> LMS Karras
>
> DPM2 Karras
>
> DPM2 a Karras
>
> DDIM
>
> PLMS
>
> Negative prompt
>
> Prompt
>
> Width
>
> Height
>
> Restore faces
>
> Tiling
>
> Highres. fix
>
> Batch count
>
> Batch size
>
> CFG Scale
>
> Seed
>
> Mask blur
>
> Sampling Steps
>
> Draw mask
>
> Upload mask
>
> Inpaint masked
>
> Inpaint not masked
>
> fill
>
> original
>
> latent noise
>
> latent nothing
>
> Inpaint at full resolution
>
> Inpaint at full resolution padding, pixels
>
> Just resize
>
> Crop and resize
>
> Resize and fill
>
> Denoising strength
注意：虽然您也可以使用本地化文本来查找控件，但是推荐使用上述清单。这将保证程序运行统一。

### 运行时机
由于页面是异步加载的，所以当元素加载完成并标记后，程序会发出一个事件。在此事件触发时，UI_control的所有值和方法均已可使用。 

```javascript
window.addEventListener("flagEnded", function(){
    //此时 标记程序已经完成工作。页面上的元素应该已经被正确找到了（说不定）
    //你的代码可以使用UI_control进行元素操作
});
```

### 注意事项
您的程序不应该更改 UI_control的值，其他程序仍有可能需要这个对象