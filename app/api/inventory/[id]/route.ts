import { db } from "@/src/db";
import { inventory } from "@/src/db/schema";
import cloudinary from "@/src/lib/cloudinary";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/inventory/[id]">
) {
  try {
    const { id } = await ctx.params;
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = Number(formData.get("price"));
    const quantity = Number(formData.get("quantity"));
    const imageFile = formData.get("image") as File | null;

    const updateValues: Record<string, unknown> = { name, category, price, quantity };

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "inventory" }, (error, result) => {
              if (error || !result) return reject(error);
              resolve(result);
            })
            .end(buffer);
        }
      );

      updateValues.imageUrl = uploadResult.secure_url;
    }

    const [updated] = await db
      .update(inventory)
      .set(updateValues)
      .where(eq(inventory.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/inventory/[id]">
) {
  try {
    const { id } = await ctx.params;

    const [deleted] = await db
      .delete(inventory)
      .where(eq(inventory.id, Number(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
