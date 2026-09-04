using System;using System.Collections.Generic;using System.Drawing;using System.Drawing.Imaging;
public static class BackgroundRemoval{
 public static void Run(string input,string output){using(var source=new Bitmap(input))using(var result=new Bitmap(source.Width,source.Height,PixelFormat.Format32bppArgb))using(var graphics=Graphics.FromImage(result)){
  graphics.DrawImageUnscaled(source,0,0);int width=source.Width,height=source.Height;var ink=new bool[width*height];
  for(int y=0;y<height;y++)for(int x=0;x<width;x++){var c=source.GetPixel(x,y);int max=Math.Max(c.R,Math.Max(c.G,c.B)),min=Math.Min(c.R,Math.Min(c.G,c.B));ink[y*width+x]=min<220||max-min>16;}
  var barrier=(bool[])ink.Clone();const int radius=3;
  for(int y=0;y<height;y++)for(int x=0;x<width;x++)if(ink[y*width+x])for(int dy=-radius;dy<=radius;dy++)for(int dx=-radius;dx<=radius;dx++){int nx=x+dx,ny=y+dy;if(nx>=0&&nx<width&&ny>=0&&ny<height)barrier[ny*width+nx]=true;}
  var exterior=new bool[width*height];var queue=new Queue<Point>();for(int x=0;x<width;x++){queue.Enqueue(new Point(x,0));queue.Enqueue(new Point(x,height-1));}for(int y=1;y<height-1;y++){queue.Enqueue(new Point(0,y));queue.Enqueue(new Point(width-1,y));}
  while(queue.Count>0){var p=queue.Dequeue();int index=p.Y*width+p.X;if(exterior[index]||barrier[index])continue;exterior[index]=true;if(p.X>0)queue.Enqueue(new Point(p.X-1,p.Y));if(p.X+1<width)queue.Enqueue(new Point(p.X+1,p.Y));if(p.Y>0)queue.Enqueue(new Point(p.X,p.Y-1));if(p.Y+1<height)queue.Enqueue(new Point(p.X,p.Y+1));}
  for(int y=0;y<height;y++)for(int x=0;x<width;x++)if(exterior[y*width+x])result.SetPixel(x,y,Color.Transparent);result.Save(output,ImageFormat.Png);
 }}
}
