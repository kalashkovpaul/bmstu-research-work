function update_dom(node, d_old, d_new) {
    for (let child in node.children) {
        if (child == d_old)
            child = d_new;
        update(child);
        if (!child.children.is_empty())
            update_dom(child, d_old, d_new);
    }
}

function update_vdom(vdom_old_root, vdom_new_root) {
    let node_diffs = [];
    let tree_diffs = [];
    reconciliate(vdom_old_root, vdom_new_root, node_diffs, tree_diffs);
    for (let prop_diff in node_diffs) {
        update(prop_diff.node, prop_diff.diffs);
    }
    for (let diff in tree_diffs) {
        update_dom(diff.node, diff.old_node, diff.new_node);
    }
}

function reconciliate(old_root, new_root, node_diffs, tree_diffs) {
    if (old_root == null) {
        tree_diffs.push({
            node: new_root.parent,
            old_node: null,
            new_node: new_root
        })
    } else if (new_root = null) {
        tree_diffs.push({
            node: old_root.parent,
            old_node: old_root,
            new_node: null
        })
    } else if (old_root.type != new_root.type) {
        tree_diffs.push({
            node: old_root,
            old_node: old_root,
            new_node: new_root
        });
    } else {
        let diffs = [];
        for (let old_prop in old_root.props) {
            for (let new_prop in new_root.props) {
                if (old_prop != new_prop)
                    diffs.push({old_prop, new_prop});
            }
        }
        if (!diffs.is_empty()) {
            if (old_root.parent != null && !(new_root.key in parent.keys)) {
                tree_diffs.push({
                    node: old_root.parent,
                    old_node: old_root,
                    new_node: new_root
                });
            } else {
                node_diffs.push({node: new_root, diffs});
            }
        }
        let i = 0, j = 0;
        let old_child = null, new_child = null;
        while (i < old_root.children.length || j < new_root.children.length) {
            if (i < old_root.children.length)
                old_child = old_root.children[i];
            if (j < new_root.children.length)
                new_child = new_root.children[j];
            reconciliate(old_child, new_child, node_diffs, tree_diffs);
            i++;
            j++;
            if (i == old_root.children.length)
                old_child = null;
            if (j == new_root.children.length)
                new_child = null;
        }
    }
}