import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Switch, Typography, Space, Divider, message } from "antd";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragOutlined } from "@ant-design/icons";

const { Text } = Typography;

function SortableStepItem({ step, onToggle }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: step.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: "#f5f5f5",
        padding: "12px 16px",
        marginBottom: 10,
        borderRadius: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Space>
                <DragOutlined {...listeners} style={{ cursor: "grab", color: "#999" }} />
                <Text>{step.name}</Text>
            </Space>
            <Switch checked={step.enabled} onChange={() => onToggle(step.id)} />
        </div>
    );
}

export default function ServiceFlowModal({ open, onCancel, onSave, flowData }) {
    const [form] = Form.useForm();
    const [steps, setSteps] = useState(flowData?.flow || []);
    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        form.setFieldsValue({ name: flowData?.name });
        setSteps(flowData?.flow || []);
    }, [flowData]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeStep = steps.find((s) => s.id === active.id);
        const overIndex = steps.findIndex((s) => s.id === over.id);

        if (activeStep.name === "Chọn Phương Thức Thanh Toán" && overIndex === 0) {
            message.warning("Không thể đặt bước 'Thanh toán' lên đầu quy trình.");
            return;
        }

        const oldIndex = steps.findIndex((s) => s.id === active.id);
        const newIndex = overIndex;
        setSteps((prev) => arrayMove(prev, oldIndex, newIndex));
    };

    const handleToggleStep = (id) => {
        setSteps((prev) =>
            prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
        );
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const payload = {
                ...flowData,
                name: values.name,
                flow: steps,
            };
            onSave(payload);
        });
    };

    return (
        <Modal
            open={open}
            title="Sửa luồng dịch vụ"
            onCancel={onCancel}
            onOk={handleSubmit}
            width={700}
            okText="Lưu luồng"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Tên dịch vụ" name="name">
                    <Input disabled />
                </Form.Item>

                <Divider orientation="left">Thứ tự và trạng thái các bước</Divider>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                        {steps.map((step) => (
                            <SortableStepItem key={step.id} step={step} onToggle={handleToggleStep} />
                        ))}
                    </SortableContext>
                </DndContext>
            </Form>
        </Modal>
    );
}
